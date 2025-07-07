import React, { useState } from "react";
import { connect } from "react-redux";
import { axiosExtender } from "../config/axios_config";
import { CenterLayout, FlexHorizontalLayout, FormFieldWrapper, Heading1, InputText, Label, MarginSpacer, PrimaryFullButton, Underline } from "../components";
import useToast from "../hooks/useToast";
import useCountdown from "../hooks/useCountDown";
import { DATA } from "../utils";
import Toast from "react-native-toast-message";
import { useRef } from "react";
import { validateEmail } from "../utils/TOOLS";
const ForgotPassword = (props) => {
    const initialData = { email: "", recovery_code: "" }
    const [formData, setFormData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const { seconds, start, isRunning } = useCountdown(10)
    const sendCodeHandler = async () => {
        if (formData.email.trim().length > 0) {
            // check email if exist
            const result_user = await axiosExtender("/user/find/user", "post", { email: formData.email })
            const user = result_user?.data
            if (result_user?.success) {
                if (user) {
                    start()
                    const sixDigitCode = Math.floor(100000 + Math.random() * 900000).toString();
                    // load email format
                    let { SUBJECT, BODY } = DATA.EMAILS.PASSWORD

                    const newData = {
                        email: formData.email,
                        subject: SUBJECT,
                        text: BODY({ name: user?.first_name + " " + user?.last_name, code: sixDigitCode })
                    }
                    const result_email = await axiosExtender("/email/send", "post", newData)
                    if (result_email.success) {
                        useToast({
                            type: "success",
                            text1: "Recovery code has been sent to your email."
                        })
                        await axiosExtender("/user/update/" + user._id, "put", { recovery_code: Number(sixDigitCode) })
                    }
                } else {
                    useToast({
                        type: "error",
                        text1: "Email is not registered!"
                    })
                }
            } else {
                console.log("error")
            }
        }
        else {
            useToast({
                type: "error",
                text1: "Invalid Email Address!"
            })
        }
    }
    const submitHandler = async () => {
        setIsLoading(true)
        // check first the email and code
        
        const result_user = await axiosExtender("/user/find/user", "post", { email: formData.email, recovery_code: formData.recovery_code })
        if (result_user?.data) {
            setFormData(initialData)
            setIsLoading(false)
            return props?.navigation?.navigate("change-password", { id: result_user?.data._id })
        }
        useToast({
            type: "error",
            text1: "Incorrect email or recovery code!"
        })
        setIsLoading(false)

    }
    return (
        <CenterLayout>
            <Heading1>
                Password Recovery
            </Heading1>
            <FormFieldWrapper>
                <Label>Email:</Label>
                <InputText placeholder="johndoe@gmail.com" value={formData.email} custom={"flex"}
                    onChange={(e) => setFormData({ ...formData, email: e, })} />
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            <FormFieldWrapper>
                <PrimaryFullButton custom="bg-white border-slate-200 border text-zinc-900" activeOpacity={!isRunning && 1} onPress={() => !isRunning && sendCodeHandler()}>{isRunning ? `[${seconds}]` : "Request Code"}</PrimaryFullButton>
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            <FormFieldWrapper>
                <Label>Recovery Code:</Label>
                <InputText placeholder="Code" custom={"flex"} value={formData.recovery_code}
                    onChange={(e) => setFormData({ ...formData, recovery_code: e, })} />
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            <FormFieldWrapper>
                <PrimaryFullButton activeOpacity={isLoading && 1} onPress={() => !isLoading && submitHandler()}>{isLoading ? "Submitting..." : "Submit"}</PrimaryFullButton>
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            <MarginSpacer space={2} />
            <FormFieldWrapper>
                <Underline onPress={() => props?.navigation.goBack()}>Back to Sign In</Underline>
            </FormFieldWrapper>
            <Toast />
        </CenterLayout>
    )
}


const mapStateToProps = (state) => {
    return {
        // auth: state.auth.auth,
        // id_temp: state.auth.id_temp,
        // email: state.auth.email_temp,
    };
};

export default connect(mapStateToProps, {})(ForgotPassword);
