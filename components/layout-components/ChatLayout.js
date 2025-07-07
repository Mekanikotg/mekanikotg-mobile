import { View, FlatList } from 'react-native'
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
const ChatLayout = ({ sent_by, room, setData, credentials, ...props }) => {
    const { isSocketConnected, sendMessage, addSocketListener, removeSocketListener } = useSocketConnection();
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    // const socket = connectSocket();
    const flatListRef = useRef();
    useEffect(() => {
        // Listen for messages from the agent
        addSocketListener(`${sent_by == "user" ? "receive_user" : "receive_agent"}_message`, (data) => {
            console.log(sent_by, data?.message?.message)
            if (data?.message && data?.room == room) {
                if (sent_by == "agent")
                    postLoad()
                setData([...props.data, data?.message]);
            }
        });
        if (isSocketConnected) {
            sendMessage('join_room', room);
        }
        return () => {
            removeSocketListener(`${sent_by == "user" ? "receive_user" : sent_by == "agent" && "receive_agent"}_message`);
        };

    }, [isSocketConnected, props.data, room]);


    const postLoad = async () => {
        const result = await axiosExtender("chat/find/distinct", "get", {})
        if (result?.success) {
            props?.setChatList(result?.data)
        }
    }

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
                user_id: credentials?._id,
                purpose: "support",
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
            sendMessage(`${sent_by == "user" ? "send_agent" : sent_by == "agent" && "send_user"}_message`, messageData);
            setData([...props.data, result?.data]);
            setMessage("")
            if (sent_by == "agent")
                postLoad()
            setIsLoading(false)
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {isSocketConnected ?
                <Paragraph custom="mb-2 bg-emerald-500 text-white text-center">Connected</Paragraph>
                :
                <Paragraph custom="mb-2 bg-yellow-500 text-white text-center">Connecting...</Paragraph>
            }
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
            <View className="p-2 px-4 pt-4 border-slate-200 border-t ">
                <InputText placeholder="Enter message." custom={""} onChange={(e) => setMessage(e)} value={message} />
                <MarginSpacer space={2} />
                <PrimaryFullButton disabled={!isSocketConnected} onPress={() => !isLoading && sendHandler()}>{isLoading ? "Sending..." : "Send"}</PrimaryFullButton>
            </View>
        </View >
    )
}

export default connect(null, { setChatList })(ChatLayout)