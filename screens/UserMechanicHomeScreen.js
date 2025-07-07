import React, { useEffect, useState } from "react";
import { setActiveBooking, setUserCredentials, setUserProviderDetails } from "../redux"
import {
  Heading2,
  LoadingLayout,
  MarginSpacer,
  MenuCardLayout,
  NewsLayout,
  Paragraph,
  ScrollViewLayout,
  WelcomeHeaderLayout,
} from "../components";
import { DATA, ICONS } from "../utils";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosExtender } from "../config/axios_config";
import Toast from "react-native-toast-message";
import { Image, Pressable, Loading, TouchableOpacity, View, Text } from "react-native";

const UserMechanicHomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (!props?.credentials) {
      checkSession()
    } else {
      checkApplication()
    }
  }, [props?.credentials])


  const checkSession = async () => {
    try {
      const user_session = await AsyncStorage.getItem("user");

      if (user_session) {
        props.setUserCredentials(JSON.parse(user_session))
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (props?.credentials?._id != null)
      if (props?.credentials.role == 0)
        loadClientCurrentBooking();
      else
        loadMechanicCurrentBooking();
  }, [props?.credentials])

  const loadClientCurrentBooking = async () => {
    const result = await axiosExtender("booking/find/latest_customer_booking/" + props?.credentials?._id, "get")
    if (result?.success) {
      if (result?.data.length > 0)
        props?.setActiveBooking(result?.data[0])
    }
    setIsLoading(false)
  }

  const loadMechanicCurrentBooking = async () => {
    const result = await axiosExtender("booking/find/latest_mechanic_booking/" + props?.credentials?._id, "get")
    if (result?.success) {
      if (result?.data.length > 0)
        props?.setActiveBooking(result?.data[0])
    }
    setIsLoading(false)
  }

  const checkApplication = async () => {
    const result = await axiosExtender("user/find/" + props?.credentials?._id, "get")
    if (result?.success) {
      if (result?.data.length > 0)
        props?.setUserProviderDetails(result?.data[0])
    }
  }

  const retrieveBookingHandler = async () => {
    // props.navigation.navigate
    setIsLoading(true)
    const result = await axiosExtender("booking/find/booking/" + props?.current_booking?._id, "get")
    if (result?.success && result?.data != null) {
      props?.navigation.navigate(props?.credentials?.role == 0 ? "mechanic-booking" : "customer-apply")
    } else {
      useToast({
        type: "error",
        text1: `Booking not existed!`,
        position: "bottom"
      });
      props?.setActiveBooking(null)
    }
    setIsLoading(false)
  }

  return (
    <>
      {isLoading &&
        <LoadingLayout />
      }

      <ScrollViewLayout>
        <WelcomeHeaderLayout data={props?.credentials} role={props?.credentials?.role} />
        <MarginSpacer space={2} />

        {props?.current_booking ?
          <View className="w-full">
            <TouchableOpacity onPress={retrieveBookingHandler}>
              <Text
                style={{ fontFamily: "semibold" }}
                className="p-4 text-center bg-blue-500 text-white rounded-md w-full">You have active booking.</Text>
            </TouchableOpacity>
          </View>
          :
          <>
            {props?.credentials?.role == 0 ?
              <>
                <Heading2>Services</Heading2>
                {props?.credentials?.account_status != 1 ?
                  <>
                    <Paragraph custom="text-center w-full rounded p-4">You must need to verify your account first to use our services. Go to profile to unlock this features.</Paragraph>
                  </>
                  :
                  <MenuCardLayout
                    data={DATA.CUSTOMERHOMESCREEN.SERVICES}
                    navigation={props.navigation}
                  />
                }
              </>
              :
              <Pressable onPress={() => props?.navigation.navigate("customer-apply")} className="rounded-md bg-emerald-500 w-full flex-row items-center justify-center">
                <Image source={ICONS.MECHANIC} className="w-4 h-4" />
                <Paragraph
                  custom="text-white text-white text-center rounded p-4">Start Job Now</Paragraph>
              </Pressable>
            }
          </>
        }

        <Heading2>Menu</Heading2>
        <MenuCardLayout
          provider={props?.provider_details}
          data={DATA.CUSTOMERHOMESCREEN.MENU}
          navigation={props.navigation}
        />
        <Heading2>News</Heading2>
        <NewsLayout data={DATA.CUSTOMERHOMESCREEN.NEWS} />
        <Toast />
      </ScrollViewLayout>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    credentials: state?.user?.credentials,
    current_booking: state?.booking?.current_booking,
    provider_details: state?.user?.provider_details
  }
}
export default connect(mapStateToProps, { setUserCredentials, setUserProviderDetails, setActiveBooking })(UserMechanicHomeScreen);