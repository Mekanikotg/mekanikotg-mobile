import React from "react";
import { setUserCredentials } from "../redux"
import {
  Heading2,
  MarginSpacer,
  MenuCardLayout,
  NewsLayout,
  ScrollViewLayout,
  WelcomeHeaderLayout,
} from "../components";
import { DATA } from "../utils";
import { connect } from "react-redux";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminHomeScreen = (props) => {
  useEffect(() => {
    if (!props?.credentials) {
      checkSession()
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
  return (
    <ScrollViewLayout>
      <WelcomeHeaderLayout data={props?.credentials} role={2} />
      <MarginSpacer space={2} />
      <Heading2>Management</Heading2>
      <MenuCardLayout
        data={DATA.ADMINHOMESCREEN.MANAGEMENT}
        navigation={props.navigation}
      />
      <Heading2>Menu</Heading2>
      <MenuCardLayout
        data={DATA.ADMINHOMESCREEN.MENU}
        navigation={props.navigation}
      />
      <Heading2>News</Heading2>
      <NewsLayout data={DATA.CUSTOMERHOMESCREEN.NEWS} />
    </ScrollViewLayout>
  );
};


const mapStateToProps = (state) => {
  return {
    credentials: state?.user?.credentials
  }
}
export default connect(mapStateToProps, { setUserCredentials })(AdminHomeScreen);