import React from 'react'
import { setUserList } from '../../redux'
import { FlexVerticalLayout, IdImage, InputText, Label, MarginSpacer, PrimaryFullButton, ScrollViewLayout, StartLayout } from '../../components'
import { axiosExtender } from '../../config/axios_config'
import useToast from '../../hooks/useToast'
import Toast from 'react-native-toast-message'
import { useState } from 'react'
import { DATA, ICONS } from '../../utils'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Image } from 'react-native'
import EXTERNALSTYLE from '../../utils/EXTERNALSTYLE'
import { View } from 'react-native'

const VerificationCrudPage = (props) => {

    const initialData = props?.route.params.item
    
    const mode = props?.route.params.mode
    const loadHandler = async () => {
        const mode = props?.route.params.mode
        let result
        if (mode == "Profile") {
            result = await axiosExtender("user/find/role", "post", { account_status: 2, role: 0 })

        } else {
            result = await axiosExtender("applicant/find/status/0", "get")
        }
        if (result?.success) {
            props?.setUserList([...result.data])
        }
    }

    const [isLoading, setIsLoading] = useState(false)
    const [newData, setNewData] = useState({
        ...initialData
    })
    const updateHandler = async (data) => {
        setIsLoading(true);
        const result = await axiosExtender(`${mode != "Profile" ? "applicant" : "user"}/update/` + newData._id, "put", data)
        if (result?.success) {
            // final alert
            loadHandler()
            useToast({
                type: "success",
                text1: `${(data?.account_status == 1 || data?.status == 1) ? "Approved" : "Declined"} Successfuly!`,
                onHide: () => props?.navigation.goBack()
            });
            // reload the list
            // send email
            let { SUBJECT, BODY } = mode == "Profile" ? DATA.EMAILS.PROFILE : DATA.EMAILS.JOB
            const emailData = {
                email: newData.email || newData.user_id?.email,
                subject: SUBJECT,
                text: BODY({
                    name: newData?.first_name || newData?.user_id?.first_name + " " + newData?.user_id?.last_name,
                    status: data?.account_status || data?.status
                })
            }
            axiosExtender("/email/send", "post", emailData)
            if (mode != "Profile" && typeof (data?.status) == "number" && data?.status == 3) {
                const res = await axiosExtender("user/update/" + initialData?.user_id?._id, "put", { "$unset": { "applicant_id": "" } })
                console.log(res)
            }
        } else {
            useToast({
                type: "error",
                text1: `Something went wrong or no internet connection!`,
                onShow: () => setIsLoading(false)
            });
        }
    }

    return (
        <ScrollViewLayout>
            <FlexVerticalLayout custom="bg-zinc-100 border-0 p-6 rounded-3xl items-center">
                {
                    newData?.profile_picture || newData?.user_id?.profile_picture ?
                        <Image source={{ uri: newData?.profile_picture || newData?.user_id?.profile_picture }} style={styles.dp2} className="object-cover" />
                        :
                        <Image source={ICONS.PROFILE} style={styles.dp2} className="object-cover" />
                }
            </FlexVerticalLayout>
            <Label>First Name: {newData?.first_name || newData.user_id?.first_name}</Label>
            <Label>Last Name: {newData?.last_name || newData.user_id?.last_name}</Label>
            <Label>Email: {newData?.email || newData.user_id?.email}</Label>
            {mode == "Profile" ?
                <>
                    <Label>Selfie Image: </Label>
                    <IdImage uri={newData?.selfie_image_link} />
                    <Label>Valid Id Image: </Label>
                    <IdImage uri={newData?.id_image_link} />
                    <MarginSpacer space={2} />
                </>
                :
                <>
                    <Label>Introduction: {newData?.message} </Label>
                    <Label>Attachments: </Label>
                    {
                        newData?.images?.map((item, key) => (
                            <View key={"images_" + key} >
                                <IdImage uri={item} />
                                <MarginSpacer space={2} />
                            </View>
                        ))
                    }
                </>
            }

            <View className="flex flex-row mb-4">
                <View className="w-1/2 pr-2">
                    <PrimaryFullButton onPress={() => !isLoading && updateHandler(mode == "Profile" ? { account_status: 1 } : { status: 1 })}>{!isLoading ? "Approve" : "..."}</PrimaryFullButton>
                </View>
                <View className="w-1/2 pl-2">
                    <PrimaryFullButton onPress={() => !isLoading && updateHandler(mode == "Profile" ? { account_status: 3 } : { status: 3 })} custom={"bg-zinc-100 text-black"}>{!isLoading ? "Decline" : "..."}</PrimaryFullButton>
                </View>

            </View>
            <Toast />
        </ScrollViewLayout >
    )
}
const styles = StyleSheet.create(EXTERNALSTYLE)


export default connect(null, { setUserList })(VerificationCrudPage)
