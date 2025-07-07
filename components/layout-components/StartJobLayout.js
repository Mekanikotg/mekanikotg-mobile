import React from 'react'
import { ButtonWithIcon, FormFieldWrapper, Heading3, LoadingLayout, MarginSpacer, Paragraph, PrimaryFullButton, Underline } from '../../components'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import * as Location from "expo-location"
import { useEffect } from 'react'
import { useRef } from 'react'
import { DATA, ICONS } from '../../utils'
import { Image } from 'react-native'
import { setActiveBooking } from "../../redux"
import { connect } from 'react-redux'
import connectSocket from '../../config/socket_config';
import { axiosExtender } from '../../config/axios_config'
import { alertHandler, getDistanceFromLatLonInKm } from '../../utils/TOOLS'
import ServiceChatLayout from './ServiceChatLayout'
import ToolsBookingLayout from './ToolsBookingLayout'
import Toast from 'react-native-toast-message'
import useToast from '../../hooks/useToast'

const StartJobPage = (props) => {

    const socket = connectSocket();
    const [room, setRoom] = useState(DATA.ROOM.SEARCHING)
    const [bookingData, setBookingData] = useState(null)
    const [messageData, setMessageData] = useState([])
    const customer_details = bookingData?.client_id

    const [booking, setBooking] = useState(false)
    const [showDetails, setShowDetails] = useState(true)
    const [selectedMapRegion, setSelectedMapRegion] = useState(DATA.PH_MAP_REGION)
    const mountedRef = useRef()
    const grantedRef = useRef()
    const service_type = "Mechanic"
    const [isLoading, setIsLoading] = useState(false)



    useEffect(() => {
        const unsubscribe = props?.navigation.addListener('beforeRemove', (e) => {
            // Prevent the default behavior (going back)

            if (booking) {
                e.preventDefault();

                alertHandler({
                    title: "Cancel Booking",
                    message: "Are you sure you want to cancel?", handler: () => {
                        props?.setActiveBooking(null)
                        setBookingData(null)
                        setMessageData([])
                        setRoom(DATA.ROOM.SEARCHING)
                        socket.emit("leave_room", "searching...");
                        setBooking(!booking);
                        props?.navigation.dispatch(e.data.action)
                    }
                })
            }
        });

        return unsubscribe; // Clean up the listener on unmount
    }, [props?.navigation, booking]);

    useEffect(() => {
        socket.on("receive_service_booking", (received_data) => {
            console.log("MECHANIC ROOM: ", room, received_data?.room)
            //console.log("MECHANIC:  ", received_data?.message)
            if (received_data?.message && received_data?.room == room && service_type == received_data?.message?.service_type) {
                if (received_data?.message?.status == "user_cancelled" && received_data?.message?.driver_id == null
                ) {
                    // if searching then cancelled
                    setBookingData(null)
                    setRoom(DATA.ROOM.SEARCHING)
                } else if (
                    received_data?.message?.status == "user_cancelled" && received_data?.message?.driver_id?._id == props?.credentials._id
                ) {
                    setRoom(DATA.ROOM.SEARCHING)
                    setBookingData(null)
                    setBooking(false)
                    setMessageData([])
                    socket.emit("leave_room", DATA.ROOM.SEARCHING);
                    socket.emit("leave_room", received_data?.message?._id);
                }
                else {
                    if (!bookingData) {
                        setBookingData(received_data?.message);
                    } else {
                        if (received_data?.message?.status == "user_cancelled")
                            setBookingData(null)
                    }
                }
            }
        });

        if (!mountedRef.current) {
            userLocationAsync()
            mountedRef.current = true
        }
        return () => {
            //socket.emit("leave_room", bookingData?._id + "_booking");
            //socket.emit("leave_room", "searching...");
            socket.off("receive_service_booking");
            socket.off("receive_service_message");
        };
    }, [socket, room, bookingData]);

    useEffect(() => {
        if (props?.current_booking) {
            setBooking(true)
            setBookingData(props?.current_booking)
            setSelectedMapRegion(props?.current_booking.driver_map)
            const newRoom = props?.current_booking?._id + "_booking"
            console.log("MECHANIC: ", props?.current_booking)


            socket.emit("join_room", DATA.ROOM.SEARCHING)
        }
        recenterMapToMarker()
    }, [socket, props?.current_booking])

    const recenterMapToMarker = async () => {
        return await userLocationAsync()
    };

    const bookNowHandler = async () => {
        if (!booking) {
            console.log("MECHANIC IS ON")
            socket.emit("join_room", DATA.ROOM.SEARCHING);
            socket.emit(`send_user_booking`, { room: DATA.ROOM.SEARCHING, });
            setBooking(!booking)
        }
        else {
            alertHandler({
                title: "Cancel Booking",
                message: "Are you sure you want to cancel?", handler: async () => {
                    setIsLoading(true)
                    const result = await axiosExtender("booking/update/" + bookingData?._id, "put", { status: "user_cancelled" })
                    if (result?.success) {
                        console.log("MECHANIC OFF")
                        props?.setActiveBooking(null)

                        let cancelData = bookingData;
                        cancelData.status = "user_cancelled";
                        const messageData = {
                            room: DATA.ROOM.SEARCHING, // Replace with the actual shared room name
                            message: { ...cancelData },
                        };
                        // future palitan mo to
                        socket.emit("join_room", messageData.room)
                        socket.emit(`send_user_booking`, messageData);
                    }
                    socket.emit("join_room", messageData.room)
                    socket.emit("leave_room", DATA.ROOM.SEARCHING);
                    setBookingData(null)
                    setMessageData([])
                    setRoom(DATA.ROOM.SEARCHING)
                    setBooking(!booking)
                    setIsLoading(false)
                }
            })
        }
    }
    const userLocationAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location denied')
        }
        grantedRef.current = true
        let location = await getLocation()

        setSelectedMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: .0025,
            longitudeDelta: .0025
        })
    }
    const getLocation = async () => {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        return location
    }

    const acceptHandler = async () => {
        setIsLoading(true)
        const { _id } = bookingData
        const newData = {
            distance: distanceHandler,
            driver_id: props?.credentials?._id,
            driver_map: selectedMapRegion,
            customer_map: bookingData?.customer_map,
            // km * 50 pesos 
            pre_price: distanceHandler < 1 ? 50 : distanceHandler * 50,
            status: "book_accepted"
        }

        const result = await axiosExtender("booking/accept/update/" + _id, "put", newData)
        if (result?.success) {
            const messageData = {
                room, // Replace with the actual shared room name
                message: { ...result?.data },
            };
            setRoom(bookingData?._id + "_booking")
            setBookingData(messageData.message)
            socket.emit("send_user_booking", messageData)
            socket.emit("join_room", bookingData?._id + "_booking")
        } else {
            setBookingData(null)
            setMessageData([])
            setRoom(DATA.ROOM.SEARCHING)
            setBooking(false)
            useToast({
                type: "error",
                text1: `Book has been accepted or cancelled by customer!`,
                position: "top"
            });
        }
        setIsLoading(false)
    }
    const arriveHandler = async () => {
        const { _id } = bookingData
        setIsLoading(true)
        const result = await axiosExtender("booking/update/" + _id, "put", {
            status: "book_arrived"
        })

        if (result?.success) {
            const messageData = {
                room, // Replace with the actual shared room name
                message: { ...bookingData, status: "book_arrived" },
            };
            setBookingData({ ...messageData.message })
            socket.emit("send_user_booking", messageData)
            props?.setActiveBooking({ ...messageData.message })
        }
        setIsLoading(false)
    }
    const distanceHandler = getDistanceFromLatLonInKm(
        bookingData?.customer_map?.latitude, // Latitude of marker 1
        bookingData?.customer_map?.longitude, // Longitude of marker 1
        selectedMapRegion?.latitude, // Latitude of marker 2
        selectedMapRegion?.longitude // Longitude of marker 2
    ).toFixed(2);

    return (
        <>
            {isLoading &&
                <LoadingLayout />}
            <View style={{ flex: 1 }} className="relative ">
                <View className="px-4 pb-4 h-auto w-full z-10 absolute bottom-0 ">
                    <View className=" relative ">
                        <View className="absolute -top-20 ">
                            <TouchableOpacity onPress={() => recenterMapToMarker(selectedMapRegion.latitude, selectedMapRegion.longitude)}>
                                <Image source={ICONS.LOCATE} className=" w-16 bg-white   h-16  rounded-full " />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* display when found */}
                    {bookingData ?
                        <View className="border border-zinc-200 bg-white rounded-md mb-4 p-4">
                            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Heading3>Customer Found</Heading3>
                                <Underline onPress={() => setShowDetails(!showDetails)}>{showDetails ? "Hide" : "Show"}</Underline>
                            </View>
                            {showDetails ?
                                <>
                                    {customer_details?.profile_picture ?
                                        <Image source={{ uri: customer_details?.profile_picture }} style={styles.dp} className=" rounded-full  object-cover" />
                                        :
                                        <Image source={ICONS.PROFILE} style={{ width: 100, height: 100 }} className="object-cover" />
                                    }
                                    <Paragraph>{customer_details?.first_name} {customer_details?.last_name}</Paragraph>
                                    <Paragraph>Mode of Payment: Cash</Paragraph>
                                    <Paragraph>Problem: {bookingData?.note}</Paragraph>
                                    <Paragraph>Distance: {bookingData?.distance || distanceHandler}Km</Paragraph>
                                    <Paragraph>Arrival Price Rate: {DATA.PESO} {bookingData?.pre_price || distanceHandler < 1 ? 50 : distanceHandler * 50}</Paragraph>
                                    <MarginSpacer space={2} />
                                    {bookingData.status == "searching" ?
                                        <>
                                            <View>
                                                <PrimaryFullButton onPress={acceptHandler}>Accept</PrimaryFullButton>
                                            </View>
                                            <MarginSpacer space={2} />
                                            <View>
                                                <PrimaryFullButton custom="bg-red-500" onPress={() => {
                                                    setBooking(false)
                                                    setBookingData(null);
                                                    socket.emit("leave_room", "searching...");
                                                }}>Decline</PrimaryFullButton>
                                            </View>
                                        </>
                                        :
                                        bookingData?.status == "book_accepted" ?
                                            <>
                                                <Heading3>Chat with Customer</Heading3>
                                                <Paragraph>To identify problems and to assist the customer.</Paragraph>

                                                <ButtonWithIcon
                                                    wrapperCustom="bg-zinc-900"
                                                    contentCustom="text-white"
                                                    onPress={() => alertHandler({
                                                        title: "Notify Customer",
                                                        message: "By continuing please be advise that you are really on the area to continue the service and if not it may affect your credits.",
                                                        handler: arriveHandler
                                                    })}
                                                    icon={ICONS.BELL}
                                                    text="Notify the customer that you have arrived."
                                                />
                                                <MarginSpacer space={2} />
                                                <ServiceChatLayout
                                                    sent_by="service"
                                                    room={bookingData?._id + "_booking"}
                                                    setData={setMessageData} data={messageData}
                                                    credentials={{ client_id: bookingData?.client_id, driver_id: bookingData?.driver_id }}
                                                />
                                                {/* </View> */}
                                                <View>
                                                    <MarginSpacer space={2} />
                                                    <PrimaryFullButton activeOpacity={booking} onPress={bookNowHandler} custom="">{booking ? "Cancel" : "Start Now"}</PrimaryFullButton>
                                                </View>
                                            </>
                                            : bookingData?.status == "book_arrived" ?
                                                <>
                                                    <Heading3>Select the tools {bookingData?.service_type}</Heading3>
                                                    <ToolsBookingLayout bookingData={bookingData} navigation={props?.navigation} setIsLoading={setIsLoading} setBooking={setBooking} />
                                                </>
                                                :
                                                <></>
                                    }
                                </>
                                : <></>}
                        </View>
                        :
                        <>
                            <View className="border border-zinc-200 bg-white rounded-md mb-4 p-4">
                                {booking ?
                                    <Paragraph>Searching now...</Paragraph> :
                                    <>
                                        {props?.credentials?.profile_picture ?
                                            <View className="">
                                                <Image source={{ uri: props?.credentials?.profile_picture }} style={styles.dp} />
                                                <MarginSpacer space={1} />
                                            </View>
                                            :
                                            <View className="">
                                                <Image source={ICONS.PROFILE} style={{ height: 80, width: 80 }} />
                                            </View>
                                        }
                                        <View>
                                            <Paragraph>Name: {props?.credentials?.first_name} {props?.credentials?.last_name}</Paragraph>
                                            <Paragraph>Email: {props?.credentials?.email}</Paragraph>
                                            <Paragraph>Accepted Payment: Cash</Paragraph>
                                        </View>
                                    </>
                                }
                            </View>
                            <PrimaryFullButton disabled={selectedMapRegion == DATA.PH_MAP_REGION} activeOpacity={booking} onPress={bookNowHandler} custom="">{booking ? "Cancel" : "Start Now"}</PrimaryFullButton>
                        </>
                    }
                </View>

                <MapView
                    style={{ height: "100%", width: "100%" }}
                    region={selectedMapRegion}
                    provider={PROVIDER_GOOGLE}
                >
                    {grantedRef.current &&
                        <>
                            <Marker
                                tracksViewChanges={false}
                                coordinate={selectedMapRegion}
                                title="You"
                            >
                                <Image source={ICONS.MECHANIC_TRACK}
                                    style={{ width: 40, height: 40 }}
                                />
                            </Marker>
                            {bookingData &&
                                <Marker
                                    tracksViewChanges={false}
                                    coordinate={{
                                        latitude: bookingData?.customer_map?.latitude,
                                        longitude: bookingData?.customer_map?.longitude,
                                    }}
                                    title="Customer"
                                    description={`${bookingData?.client_id?.first_name} ${bookingData?.client_id?.last_name}`}
                                >
                                    <Image source={ICONS.PIN}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </Marker>
                            }
                        </>
                    }
                </MapView>
                <Toast />
            </View >
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        credentials: state?.user?.credentials,
        provider_details: state?.user?.provider_details,
        current_booking: state?.booking?.current_booking,
    }
}
export default connect(mapStateToProps, { setActiveBooking })(StartJobPage)
const styles = StyleSheet.create(EXTERNALSTYLE)
