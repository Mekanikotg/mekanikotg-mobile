import React, { useState } from "react";
import {
  CenterLayout,
  FormFieldWrapper,
  Heading1,
  InputPassword,
  InputText,
  Label,
  PrimaryFullButton,
  Underline,
} from "../components";
import { axiosExtender } from "../config/axios_config";
import { connect } from "react-redux";
import { setUserCredentials } from "../redux"
import Toast from "react-native-toast-message";
import useToast from "../hooks/useToast";
import useCheckerField from "../hooks/useCheckerField";
import { validateEmail } from "../utils/TOOLS";

const RegisterScreen = (props) => {
  const [credentials, setCredentials] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);

  const signUpHandler = async () => {
    credentials.email = credentials.email.trim()
    if (useCheckerField(Object.values(credentials)) > 0 || !validateEmail(credentials.email)) {
      return useToast({
        type: "error",
        text1: `Please fill up the fields correctly!`,
      });
    }
    if (credentials?.password != credentials?.confirm_password) {
      return useToast({
        type: "error",
        text1: `Password mismatch!`,
      });
    }
    setIsLoading(true);
    const result = await axiosExtender("user/add", "post", credentials)
    if (result?.success) {
      useToast({
        type: "success",
        text1: `Registered Successfuly. You will be redirected to login.`,
        onHide: () => {
          props?.navigation?.navigate("login")
        },
      });
    } else {
      useToast({
        type: "error",
        text1: result?.error_code == 11000 ? `Email already exist!` : `Something went wrong or no internet connection!`,
        onShow: () =>
          setIsLoading(false)
      });

    }
  };
  const hidePasswordHandler = () => {
    setPasswordHidden(!passwordHidden);
  };
  const hideConfirmPasswordHandler = () => {
    setConfirmPasswordHidden(!confirmPasswordHidden);
  };
  return (
    <CenterLayout>
      <Heading1>Register</Heading1>
      <FormFieldWrapper>
        <Label>First Name:</Label>
        <InputText placeholder="First Name" editable={!isLoading}
          onChange={(e) => setCredentials({ ...credentials, first_name: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Last Name:</Label>
        <InputText placeholder="Last Name" editable={!isLoading}
          onChange={(e) => setCredentials({ ...credentials, last_name: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Email:</Label>
        <InputText placeholder="Email" editable={!isLoading}
          onChange={(e) => setCredentials({ ...credentials, email: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Password:</Label>
        <InputPassword
          secureTextEntry={passwordHidden}
          hideHandler={hidePasswordHandler}
          editable={!isLoading}
          placeholder="Password"
          onChangeText={(e) => setCredentials({ ...credentials, password: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Confirm Password:</Label>
        <InputPassword
          secureTextEntry={confirmPasswordHidden}
          hideHandler={hideConfirmPasswordHandler}
          editable={!isLoading}
          placeholder="Confirm Password"
          onChangeText={(e) => setCredentials({ ...credentials, confirm_password: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Underline onPress={() => props?.navigation.navigate("eula")} activeOpacity={isLoading}>
          Please read the End-User License Agreement.
        </Underline>
        <Underline onPress={() => props?.navigation.navigate("terms")} activeOpacity={isLoading}>
          By registering in our app, please read the Terms and Conditions.
        </Underline>
      </FormFieldWrapper>
      <FormFieldWrapper>
        <PrimaryFullButton activeOpacity={isLoading} onPress={() => {
          !isLoading && signUpHandler()
        }}>{isLoading ? "Please wait..." : "Sign Up"}</PrimaryFullButton>
      </FormFieldWrapper>
      <Underline onPress={() =>
        !isLoading &&
        props?.navigation.goBack()} activeOpacity={isLoading}>Already have an account?</Underline>
      <Toast />
    </CenterLayout >
  );
};

export default connect(null, { setUserCredentials })(RegisterScreen);
