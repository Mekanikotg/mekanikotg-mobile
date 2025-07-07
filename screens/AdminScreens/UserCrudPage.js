import React from 'react'
import { setUserModifyDone, setUserList } from '../../redux'
import { ButtonWithIcon, FormFieldWrapper, InputText, Label, MarginSpacer, PrimaryFullButton, ScrollViewLayout, StartLayout } from '../../components'
import { axiosExtender } from '../../config/axios_config'
import useToast from '../../hooks/useToast'
import Toast from 'react-native-toast-message'
import { useState } from 'react'
import useCheckerField from '../../hooks/useCheckerField'
import { ICONS } from '../../utils'
import { connect } from 'react-redux'
import { useEffect } from 'react'

const UserCrudPage = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [newData, setNewData] = useState({
        first_name: "",
        last_name: "",
        email: "",
    })
    const updateHandler = async () => {
        if (useCheckerField(Object.values(newData)) > 0) {
            return useToast({
                type: "error",
                text1: `Please fill up the fields correctly!`,
            });
        }
        setIsLoading(true);
        const result = await axiosExtender("user/update/" + props?.selected_user._id, "put", { is_deleted: !newData.is_deleted })
        if (result?.success) {
            setNewData({ ...newData, is_deleted: !newData?.is_deleted })
            await loadHandler()
            useToast({
                type: "success",
                text1: `${props?.selected_user ? "Update Successfuly!" : "Added Successfuly"} `,
            });
        } else {
            useToast({
                type: "error",
                text1: `Something went wrong or no internet connection!`,
                onShow: () =>
                    setIsLoading(false)
            });
        }
        setIsLoading(false);
    }

    const loadHandler = async () => {
        const result = await axiosExtender("user/find/role/0", "post")
        if (result?.success) {
            props?.setUserList([...result.data])
            props?.setUserModifyDone(!props.modify_done)
        }
    }
    useEffect(() => {
        if (props?.selected_user) {
            const { first_name, last_name, email, is_deleted } = props?.selected_user;
            setNewData(
                {
                    first_name,
                    last_name,
                    email,
                    is_deleted
                }
            )
        }
    }, [props?.selected_user])


    return (
        <ScrollViewLayout>
            <FormFieldWrapper>
                <Label>First Name:</Label>
                <InputText placeholder="First Name" editable={false}
                    value={newData.first_name}
                />
            </FormFieldWrapper>
            <FormFieldWrapper>
                <Label>Last Name:</Label>
                <InputText placeholder="Last Name" editable={false}
                    value={newData.last_name}
                />
            </FormFieldWrapper>
            <FormFieldWrapper>
                <Label>Email:</Label>
                <InputText placeholder="Email" editable={false}
                    value={newData.email}
                />
            </FormFieldWrapper>
            <FormFieldWrapper>
                <Label>Account Status:</Label>
                <InputText editable={false}
                    value={newData.is_deleted ? "Inactive" : "Active"}
                    onChange={(e) => setNewData({ ...newData, email: e })}
                />
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            <FormFieldWrapper>
                <ButtonWithIcon
                    icon={ICONS.SAVE}
                    activeOpacity={isLoading && 1}
                    wrapperCustom="bg-zinc-900 p-4"
                    onPress={() => !isLoading && updateHandler()}
                    contentCustom="text-white text-lg"
                    text={isLoading ? "Saving..." : `Change status ${!newData?.is_deleted ? "InActive" : "Active"}`} />
            </FormFieldWrapper>
            <Toast />
        </ScrollViewLayout>
    )
}

const mapStateToProps = (state) => {
    return {
        modify_done: state.user.modify_done,
        selected_user: state?.user?.selected_user
    }
}
export default connect(mapStateToProps, { setUserList, setUserModifyDone })(UserCrudPage)
