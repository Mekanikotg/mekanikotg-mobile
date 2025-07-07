import React from 'react'
import { ButtonWithIcon, ChatLayout, FlexHorizontalLayout, FormFieldWrapper, Heading3, InputText, LoadingLayout, MarginSpacer, Paragraph, PrimaryFullButton, ScrollViewLayout, Underline } from '../../components'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import { Linking, Pressable, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import * as Location from "expo-location"
import { useEffect } from 'react'
import { useRef } from 'react'
import { DATA, ICONS } from '../../utils'
import { Image } from 'react-native'
import connectSocket from '../../config/socket_config';
import { connect } from 'react-redux'
import useToast from '../../hooks/useToast'
import { axiosExtender } from '../../config/axios_config'
import { alertHandler } from '../../utils/TOOLS'
import Toast from 'react-native-toast-message'
import useCountdown from '../../hooks/useCountDown'
import { Text } from 'react-native'
import ServiceChatLayout from '../../components/layout-components/ServiceChatLayout'
import { setActiveBooking } from '../../redux'
const CustomerBookingPage = (props) => {
    const socket = connectSocket();
    const [room, setRoom] = useState(DATA.ROOM.SEARCHING)
    const service_type = "Mechanic"

    const [bookingData, setBookingData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [booking, setBooking] = useState(false)
    const [note, setNote] = useState("")
    const [comment, setComment] = useState("")
    const [selectedMapRegion, setSelectedMapRegion] = useState(DATA.PH_MAP_REGION)

    const mountedRef = useRef()
    const grantedRef = useRef()

    const [currentBook, setCurrentBook] = useState(null);

    const [messageData, setMessageData] = useState([])
    const [showDetails, setShowDetails] = useState(true)
    const driver_details = bookingData?.driver_id
    const [problem, setProblem] = useState([false, false, false, false, false])

    const [starRating, setStarRating] = useState(0)
    const bookAcceptedRef = useRef(false)


    const { seconds, start, stop, isRunning } = useCountdown(20)

    useEffect(() => {
        socket.on("receive_user_booking", (received_data) => {
            if (received_data?.message && received_data?.message?.client_id?._id == props?.credentials?._id) {
                bookAcceptedRef.current = true
                stop();
                setBookingData(received_data?.message);

                if (received_data?.message?.status == "book_accepted") {
                    const newRoom = received_data?.message?._id + "_booking"
                    socket.emit("join_room", newRoom)
                    setRoom(newRoom)
                }
                else if (received_data?.message?.status == "completed") {
                    props?.setActiveBooking(null)
                }
                else if (received_data?.message?.status == "user_cancelled") {
                    setBookingData(null)
                    setBooking(false)
                    setMessageData([])
                    setCurrentBook(null)
                    setRoom(DATA.ROOM.SEARCHING)
                }
            }
        });

        if (!mountedRef.current) {
            userLocationAsync()
            mountedRef.current = true
        }
        return () => {
            socket.off("receive_user_booking");
        };
    }, [socket, room, bookingData]);


    useEffect(() => {
        if (props?.current_booking) {
            setBooking(true)
            setSelectedMapRegion(props?.current_booking.customer_map)
            setCurrentBook(props?.current_booking)
            setBookingData(props?.current_booking)
            const newRoom = props?.current_booking?._id + "_booking"

            socket.emit("join_room", DATA.ROOM.SEARCHING)
        }
        recenterMapToMarker()
    }, [socket, props?.current_booking])

    useEffect(() => {
        const unsubscribe = props?.navigation.addListener('beforeRemove', (e) => {
            // Prevent the default behavior (going back)
            if (bookingData?.status == "completed") {
                props?.navigation.dispatch(e.data.action)
                return
            }

            if (booking) {
                e.preventDefault();

                alertHandler({
                    title: "Cancel Booking",
                    message: "Are you sure you want to cancel?", handler: () => {
                        cancelDBHandler(currentBook?._id);
                        props?.navigation.dispatch(e.data.action)

                    }
                })
            }
        });

        return unsubscribe; // Clean up the listener on unmount
    }, [props?.navigation, booking, bookingData]);

    useEffect(() => {
        if (seconds == 0) {
            if (!bookAcceptedRef.current) {
                cancelDBHandler(currentBook?._id)
            }
        }
    }, [seconds])

    const submitHandler = async () => {
        setIsLoading(true)
        const result = await axiosExtender("booking/update/" + bookingData?._id, "put", { comment, star: starRating })
        if (result?.success) {
            // load email format
            let { SUBJECT, BODY } = DATA.EMAILS.RATING

            const newData = {
                email: driver_details.email,
                subject: SUBJECT,
                text: BODY({ name: driver_details?.first_name + " " + driver_details?.last_name, starRating, comment })
            }
            await axiosExtender("/email/send", "post", newData)
            setBooking(false)
        }
        setIsLoading(false)
    }
    const recenterMapToMarker = async () => {
        return await userLocationAsync()
    };

    const bookDBHandler = async (newData) => {
        const result = await axiosExtender("booking/add", "post", { ...newData })
        if (result?.success) {
            return result?.data
        }
        return null
    }

    const cancelDBHandler = async (_id) => {
        setIsLoading(true)
        const result = await axiosExtender("booking/update/" + _id, "put", { status: "user_cancelled" })
        if (result?.success) {
            const cancelData = currentBook;
            cancelData.status = "user_cancelled";
            const messageData = {
                room: DATA.ROOM.SEARCHING, // Replace with the actual shared room name
                message: { ...bookingData, ...cancelData },
            };
            if (bookingData?.status == "book_accepted")
                messageData.room = _id + "_booking"
            if (props?.current_booking != null)
                props?.setActiveBooking(null)
            socket.emit("join_room", messageData.room)
            socket.emit(`send_service_booking`, messageData);
            socket.emit("leave_room", DATA.ROOM.SEARCHING);
            stop();
            setBookingData(null);
            setMessageData([])
            setRoom(DATA.ROOM.SEARCHING)
            setBooking(false)
        }
        setIsLoading(false)
    }

    const bookNowHandler = async () => {
        bookAcceptedRef.current = false;
        if (!booking)
            if ((problem.filter(i => i == true).length == 0) ||
                (problem[4] == true && (problem.filter(i => i == true).length == 1) && note.trim().length == 0)) {
                return useToast({
                    type: "error",
                    text1: `Please fill up the fields correctly!`,
                    position: "top"
                });
            }

        let temp = []
        for (let i in problem) {
            if (problem[i] == true) {
                temp.push(`${DATA.MECHANIC_PROBLEMS[i]}`)
            }
        }
        let newNote = temp.join(', ')
        newNote += `\nNote: ${note} `;
        const newData = {
            client_id: props?.credentials?._id,
            note: newNote,
            service_type,
            status: "searching"
        }
        if (!booking) {
            setIsLoading(true)
            // booking add then get the data populated
            const data_db = await bookDBHandler(newData)
            setCurrentBook(data_db);
            start()
            const messageData = {
                room: DATA.ROOM.SEARCHING, // Replace with the actual shared room name
                message: { ...data_db, customer_map: selectedMapRegion },
            };

            socket.emit("join_room", DATA.ROOM.SEARCHING);
            socket.emit(`send_service_booking`, messageData);
            setRoom(data_db?._id + "_booking")
            setBooking(true)
            setIsLoading(false)
        }
        else {
            alertHandler({
                title: "Cancel Booking",
                message: "Are you sure you want to cancel?", handler: () => {
                    cancelDBHandler(currentBook?._id)
                }
            })
        }
    }

    const userLocationAsync = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location denied')
            }
            grantedRef.current = true
            let location = await getLocation()

            if (location)
                setSelectedMapRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: .0025,
                    longitudeDelta: .0025
                })
        } catch (e) {
            console.log("Error in map", e.message)
        }
    }
    const dialNumber = (phoneNumber) => {
        const url = `tel:${phoneNumber} `;
        Linking.openURL(url)
            .then(() => console.log(`Dialing ${phoneNumber} `))
            .catch((error) =>
                console.error(`Failed to dial ${phoneNumber}: ${error} `)
            );
    };

    const getLocation = async () => {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        return location
    }

    return (
        <>
            {isLoading && <LoadingLayout />}
            <View style={{ flex: 1 }} className="relative">
                <View className="px-4 pb-4 h-auto w-full z-10 absolute bottom-0 ">
                    <View className=" relative ">
                        <View className="absolute -top-20 ">
                            <TouchableOpacity onPress={() => recenterMapToMarker(selectedMapRegion.latitude, selectedMapRegion.longitude)}>
                                <Image source={ICONS.LOCATE} className=" w-16 bg-white   h-16 rounded-full" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="border border-zinc-200 bg-white rounded-md mb-4 p-4">

                        {["book_accepted", "book_arrived", "completed"].includes(bookingData?.status) ? <>
                            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Heading3>{service_type} Found</Heading3>
                                <Underline onPress={() => setShowDetails(!showDetails)}>{showDetails ? "Hide" : "Show"}</Underline>
                            </View>
                            {showDetails ?
                                <View>

                                    {driver_details.profile_picture ?
                                        <Image source={{ uri: driver_details.profile_picture }} style={styles.dp} className="rounded-full  object-cover" />
                                        :
                                        <Image source={ICONS.PROFILE} style={styles.dp} className="object-cover" />
                                    }
                                    <Paragraph>{`${driver_details?.first_name} ${driver_details?.last_name} `}</Paragraph>
                                    <Paragraph>Mode of Payment: Cash</Paragraph>
                                    <Paragraph>Distance: {bookingData?.distance}Km</Paragraph>
                                    <Paragraph>{bookingData?.service_type} Arrival Price: {DATA.PESO} {bookingData?.pre_price}</Paragraph>
                                    <Pressable onPress={() => dialNumber(driver_details?.contact)} className="rounded-md bg-emerald-500 w-full flex-row items-center justify-center">
                                        <Image source={ICONS.TELEPHONE_CALL} className="w-4 h-4" />
                                        <Paragraph
                                            custom="text-white text-white text-center rounded p-4">Call: {driver_details?.contact}</Paragraph>
                                    </Pressable>
                                    {bookingData?.status == "book_accepted" ?
                                        <>
                                            <Heading3>Chat with {bookingData?.service_type}</Heading3>
                                            <Paragraph></Paragraph>
                                            <ServiceChatLayout
                                                sent_by="user"
                                                room={bookingData?._id + "_booking"}
                                                setData={setMessageData} data={messageData}
                                                credentials={{ client_id: bookingData?.client_id, driver_id: bookingData?.driver_id }}
                                            />
                                        </>
                                        :
                                        bookingData?.status == "book_arrived" ?
                                            <View className="py-8">
                                                <Heading3 custom="text-center">Your Mechanic has arrived!</Heading3>
                                                <Paragraph custom="text-center py-4">You may now talk to your {service_type} personally and please provide valuable information to assist you with your concern. </Paragraph>
                                            </View>
                                            :
                                            bookingData?.status == "completed" ?
                                                <View className="py-8">
                                                    <Heading3 custom="text-center">Thank you for using our services!</Heading3>
                                                    <MarginSpacer space={2} />
                                                    {booking ?
                                                        <>
                                                            <View className="flex-row justify-center">
                                                                {[1, 2, 3, 4, 5].map((i) => (
                                                                    <Pressable onPress={() => setStarRating(i)} key={`star - ${i} `} >
                                                                        <Image source={starRating < i ? ICONS.STAR : ICONS.STARFILLED} className="m-2" style={{ width: 40, height: 40 }} />
                                                                    </Pressable>
                                                                ))}
                                                            </View>

                                                            <Paragraph custom="text-center">You may now rate the mechanic</Paragraph>
                                                            <MarginSpacer space={2} />
                                                            <InputText numberOfLines={2} value={comment} onChange={setComment} placeholder={`Type a comment `} />
                                                            <MarginSpacer space={2} />
                                                            <FormFieldWrapper>
                                                                <PrimaryFullButton onPress={submitHandler}>Submit</PrimaryFullButton>
                                                            </FormFieldWrapper>
                                                        </>
                                                        :
                                                        <FormFieldWrapper>
                                                            <PrimaryFullButton custom="bg-zinc-900" onPress={() => props?.navigation.goBack()}>Return Home</PrimaryFullButton>
                                                        </FormFieldWrapper>}

                                                </View>
                                                :
                                                <>
                                                </>
                                    }
                                </View> :
                                <></>
                            }
                        </>
                            :
                            booking ?
                                <>
                                    <Paragraph>Searching {service_type} now...</Paragraph>
                                    <Paragraph>Booking Timer: {seconds}</Paragraph>
                                </>
                                :
                                <>
                                    <Paragraph>Mode of Payment: Cash</Paragraph>
                                    <Paragraph>What seems to be the problem:</Paragraph>
                                    {DATA.MECHANIC_PROBLEMS.map((item, key) => (
                                        <Pressable key={`${key} -problem`} className="flex-row mt-2 mb-2 items-center" onPress={() => {
                                            let prev = [...problem]
                                            prev[key] = !problem[key]
                                            setProblem(prev)
                                        }}>
                                            <View className="h-5 w-5 items-center justify-center border border-emerald-400 mr-2">
                                                {problem[key] && <Text className="text-emerald-400">✓</Text>}
                                            </View>
                                            <Paragraph>{key == 4 ? `${item} (Please specify the problem)` : item}</Paragraph>
                                        </Pressable>
                                    ))}
                                    <InputText numberOfLines={2} value={note} onChange={setNote} placeholder={`Provide information for ${service_type}.`} />
                                </>
                        }
                    </View>
                    {
                        (bookingData?.status != "book_arrived" && bookingData?.status != "completed") &&
                        <PrimaryFullButton activeOpacity={booking} onPress={bookNowHandler} custom="">{booking ? "Cancel" : "Book Now"}</PrimaryFullButton>
                    }
                </View>


                {/* MAP SECTION  */}
                <MapView
                    style={{ height: "100%", width: "100%" }}
                    region={selectedMapRegion}
                    provider={PROVIDER_GOOGLE}
                >
                    {grantedRef.current &&
                        <>
                            {/* CUSTOMER LOCATION  */}
                            <Marker
                                tracksViewChanges={false}
                                coordinate={selectedMapRegion}
                                title="You"
                                description={`Searching for ${service_type}...`}
                            >
                                <Image source={ICONS.PIN}
                                    style={{ width: 40, height: 40 }}
                                />
                            </Marker>
                            {/* MECHANIC LOCATION  */}
                            {bookingData &&
                                <Marker
                                    tracksViewChanges={false}
                                    coordinate={{
                                        latitude: bookingData?.driver_map.latitude,
                                        longitude: bookingData?.driver_map.longitude,
                                    }}
                                    title={bookingData?.service_type}
                                    description={`${driver_details?.first_name} ${driver_details?.last_name} `}
                                >
                                    <Image source={ICONS.MECHANIC_TRACK}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </Marker>
                            }
                        </>
                    }
                </MapView>
                <Toast />
            </View>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        credentials: state?.user?.credentials,
        current_booking: state?.booking?.current_booking,
    }
}

export default connect(mapStateToProps, { setActiveBooking })(CustomerBookingPage)
const styles = StyleSheet.create(EXTERNALSTYLE)