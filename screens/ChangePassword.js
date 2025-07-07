import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import { CenterLayout, FormFieldWrapper, Heading1, InputPassword, Label, MarginSpacer, PrimaryFullButton, ScrollViewLayout, Underline } from '../components'
import { useState } from 'react'
import { useEffect } from 'react'
import useCheckerField from '../hooks/useCheckerField'
import { axiosExtender } from '../config/axios_config'
import useToast from '../hooks/useToast'
import Toast from 'react-native-toast-message'

const ChangePassword = (props) => {
    const idRef = useRef()
    useEffect(() => {
        const { id } = props.route.params;
        idRef.current = id
        console.log(id)
    }, [])
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
        const result = await axiosExtender("/user/change-password/" + idRef.current, "post", { password: formData?.password })
        if (result?.success) {
            return useToast({
                type: "success",
                "text1": "Password changed successfuly",
                onHide: () => {
                    setIsLoading(false)
                    props?.navigation.replace("login")
                }
            })
        }
        console.log(result)
        useToast({
            type: "error",
            text1: "Something went wrong!"
        })
        setIsLoading(false)


    }
    return (
        <CenterLayout>
            <Heading1>
                Change Password
            </Heading1>
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
            <FormFieldWrapper>
                <Underline onPress={() => props?.navigation.goBack()}>Back to Sign In</Underline>
            </FormFieldWrapper>
            <Toast />
        </CenterLayout >
    )
}

export default ChangePassword

const styles = StyleSheet.create({})