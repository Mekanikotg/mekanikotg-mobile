import { View, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MarginSpacer from '../spacer-components/MarginSpacer'
import InputText from '../textbox-components/InputText'
import PrimaryFullButton from '../button-components/PrimaryFullButton'
import Paragraph from '../text-components/Paragraph'
import { useState } from 'react'
import { axiosExtender } from '../../config/axios_config'
import useToast from '../../hooks/useToast'
import { setChatList } from "../../redux"
import { connect } from 'react-redux'
import { useSocketConnection } from '../../hooks/useSocketConnection'
const ServiceChatLayout = ({ room, sent_by, setData, credentials, ...props }) => {
    const { isSocketConnected, sendMessage, addSocketListener, removeSocketListener } = useSocketConnection();
    const { height } = Dimensions.get("screen")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const flatListRef = useRef();
    useEffect(() => {
        // Listen for messages from the service
        addSocketListener(`${sent_by == "user" ? "receive_user" : sent_by == "service" && "receive_service"}_message`, (data) => {
            if (data?.message && data?.room == room) {
                setData([...props.data, data?.message]);
            }
        });
        if (isSocketConnected) {
            sendMessage('join_room', room);
        }
        return () => {
            removeSocketListener(`${sent_by == "user" ? "receive_user" : sent_by == "service" && "receive_service"}_message`);
        };
    }, [props.data, isSocketConnected, room]);

    const CustomerChatUI = ({ message }) => {
        return <>
            <View className="flex flex-row items-center justify-end">
                <Paragraph custom=" p-1 rounded-lg px-3 text-white bg-zinc-900 w-auto">{message}</Paragraph>
            </View>
            <MarginSpacer space={2} />
        </>
    }

    const HelperChatUI = ({ message }) => {
        return <>
            <View className="flex flex-row items-center justify-start">
                <Paragraph custom="p-1 rounded-lg px-3 bg-zinc-200">{message}</Paragraph>
            </View>
            <MarginSpacer space={2} />
        </>
    }
    const sendHandler = async () => {
        if (message?.trim().length > 0) {
            const newData = {
                message,
                user_id: credentials?.client_id,
                driver_id: credentials?.driver_id,
                purpose: "booking",
                sent_by
            }
            setIsLoading(true)
            const result = await axiosExtender("chat/add", "post", newData)
            if (!result?.success)
                return useToast({ text1: "Message can't be send", type: "error" })

            const messageData = {
                room, // Replace with the actual shared room name
                message: result.data,
            };
            sendMessage("join_room", room);
            sendMessage(`${sent_by == "user" ? "send_service" : sent_by == "service" && "send_user"}_message`, messageData);
            setData([...props.data, result?.data]);
            setMessage("")
            setIsLoading(false)
        }
    }
    return (
        <View style={{ flex: 1, height: height * .3, backgroundColor: "white" }} className="border rounded-md border-zinc-300 p-2">
            <FlatList
                ref={flatListRef}
                data={props?.data}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    let component =
                        item?.sent_by == sent_by ?
                            <CustomerChatUI message={item?.message} key={item?._id} />
                            :
                            <HelperChatUI message={item?.message} key={item?._id} />
                    return component
                }
                }
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            />
            <View className="p-2 pt-4 items-center border-slate-200 border-t flex-row ">
                <View style={{ width: "70%" }}>
                    <InputText placeholder="Enter message." custom={""} onChange={(e) => setMessage(e)} value={message} />
                </View>
                <View style={{ width: "30%", marginLeft: 5 }}>
                    <PrimaryFullButton custom="p-3" onPress={() => !isLoading && sendHandler()}>{isLoading ? "Sending..." : "Send"}</PrimaryFullButton>
                </View>
            </View>
        </View >
    )
}

export default connect(null, { setChatList })(ServiceChatLayout)