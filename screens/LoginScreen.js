import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
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
import useToast from "../hooks/useToast";
import { setUserCredentials } from "../redux"
import { connect } from "react-redux";
import useCheckerField from "../hooks/useCheckerField";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const storeHandler = async (item) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(item));
    } catch (e) {
      console.log("Warning set in Login.js: " + e);
    }
  };
  const signInHandler = async () => {
    if (useCheckerField(Object.values(credentials)) > 0) {
      return useToast({
        type: "error",
        text1: `Please fill up the fields correctly!`,
      });
    }
    setIsLoading(true);
    const result = await axiosExtender("/auth/login", "post", credentials)

    if (result?.success) {
      useToast({
        type: "success",
        text1: `Welcome ${result?.data?.first_name} ${result?.data?.last_name}`,
        onShow: () => { },
        onHide: () => {
          storeHandler(result?.data);
          props?.setUserCredentials(result?.data);
          let user_role = result.data?.role;
          switch (Number(user_role)) {
            case 0:
            case 1:
              props?.navigation.replace("customer-home")
              break;
            case 2:
              props?.navigation.replace("admin-home")
              break;
            default:
              break;
          }
          setIsLoading(false)
        }
      });
    } else {
      useToast({
        type: "error",
        text1: result?.errors ? "Wrong Email Address or Password." : "Something went wrong or network error!",
      });
      setIsLoading(false);
    }
  };
  const signUpHandler = () => {
    props.navigation.navigate("register");
  };
  const hidePasswordHandler = () => {
    setPasswordHidden(!passwordHidden);
  };
  return (
    <CenterLayout classContainer="">
        <Heading1>Log In</Heading1>
        <FormFieldWrapper>
          <Label>Email:</Label>
          <InputText
            placeholder="Email"
            editable={!isLoading}
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
          <Underline activeOpacity={isLoading} onPress={() => {
            !isLoading &&
              props.navigation.navigate("forgot-password")
          }}>Forgot your password?</Underline>
        </FormFieldWrapper>
        <FormFieldWrapper>
          <PrimaryFullButton activeOpacity={isLoading} onPress={() => !isLoading && signInHandler()}>{isLoading ? "Signing In..." : "Sign In"}</PrimaryFullButton>
        </FormFieldWrapper>
        <Underline activeOpacity={isLoading} onPress={() => {
          !isLoading &&
            signUpHandler()
        }}>Don't have an account?</Underline>
        <Toast />
    </CenterLayout>
  );
};

export default connect(null, {
  setUserCredentials,
})(LoginScreen);

const styles = StyleSheet.create({});
