import { View, Text } from 'react-native'
import React from 'react'
import { FormFieldWrapper, InputPassword, Label, MarginSpacer, PrimaryFullButton, ScrollViewLayout } from '../../components'
import { useState } from 'react'
import useToast from '../../hooks/useToast'
import useCheckerField from '../../hooks/useCheckerField'
import { connect } from 'react-redux'
import { axiosExtender } from '../../config/axios_config'

const ProfilePasswordPage = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        password: "",
        confirm_password: ""
    })
    const [passwordHidden, setPasswordHidden] = useState({
        password: true,
        confirm_password: true
    })
    const fieldArray = [
        {
            label: "Password",
            secureTextEntry: passwordHidden.password,
            hideHandler: () => setPasswordHidden({ ...passwordHidden, password: !passwordHidden.password }),
            onChangeText: (e) => setFormData({ ...formData, password: e })
        },
        {
            label: "Confirm Password",
            secureTextEntry: passwordHidden.confirm_password,
            hideHandler: () => setPasswordHidden({ ...passwordHidden, confirm_password: !passwordHidden.confirm_password }),
            onChangeText: (e) => setFormData({ ...formData, confirm_password: e })
        },
    ]
    const submitHandler = async () => {
        if (useCheckerField(Object.values(formData)) > 0) {
            return useToast({
                type: "error",
                text1: `Please fill up the fields correctly!!`,
            });
        }
        // validations
        const mismatch_error = formData?.password !== formData?.confirm_password
        const length_error = formData?.password.length < 7
        if (mismatch_error || length_error)
            return useToast({
                type: "error",
                "text1": mismatch_error ? "Password Mismatch!" : "Password must be atleast 8 characters!",
            })
        setIsLoading(true)
        const result = await axiosExtender("/user/change-password/" + props?.credentials?._id, "post", { password: formData?.password })
        if (result?.success) {
            return useToast({
                type: "success",
                "text1": "Password changed successfuly",
                onHide: () => {
                    setIsLoading(false)
                    props?.navigation.goBack()
                }
            })
        } else {
            useToast({
                type: "error",
                text1: "Something went wrong!"
            })
        }
        setIsLoading(false)
    }
    return (
        <ScrollViewLayout>
            <FormFieldWrapper>
                {fieldArray.map(({ label, hideHandler, secureTextEntry, onChangeText }, key) => (
                    <View key={"password-" + key}>
                        <Label>{label}</Label>
                        <InputPassword
                            secureTextEntry={secureTextEntry}
                            hideHandler={hideHandler}
                            editable={!isLoading}
                            onChangeText={onChangeText}
                        />
                    </View>
                ))}
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            <FormFieldWrapper>
                <PrimaryFullButton custom=""
                    onPress={!isLoading && submitHandler}
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </PrimaryFullButton>
            </FormFieldWrapper>
        </ScrollViewLayout>
    )
}

const mapStateToProps = (state) => {
    return {
        credentials: state?.user?.credentials
    }
}
export default connect(mapStateToProps, {})(ProfilePasswordPage);

