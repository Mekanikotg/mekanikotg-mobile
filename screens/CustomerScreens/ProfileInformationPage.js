import React, { useEffect, useState } from "react";
import {
  FlexHorizontalLayout,
  FlexVerticalLayout,
  FormFieldWrapper,
  Heading2,
  Heading3,
  InputText,
  Label,
  MarginSpacer,
  Paragraph,
  PrimaryFullButton,
  ScrollViewLayout,
  StartLayout,
  Underline,
} from "../../components";
import { connect } from "react-redux";
import { Image } from "react-native";
import { setUserCredentials } from "../../redux"
import { View } from "react-native";
import useCheckerField from "../../hooks/useCheckerField";
import useToast from "../../hooks/useToast";
import { axiosExtender } from "../../config/axios_config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import { DATA, ICONS, TOOLS } from "../../utils";
import EXTERNALSTYLE from "../../utils/EXTERNALSTYLE";
import * as ImagePicker from "expo-image-picker";
import { Text } from "react-native";
import { objectHasBlank, validateEmail } from "../../utils/TOOLS";
import { TouchableOpacity } from "react-native";

const ProfileInformationPage = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [profileDetails, setProfileDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    city: "",
    house_no: ""
  })
  const [image, setImage] = useState(null);
  const [enableUpdate, setEnableUpdate] = useState(false);
  const saveHandler = async () => {
    if (useCheckerField(Object.values(profileDetails)) > 0 || !validateEmail(profileDetails.email)) {
      return useToast({
        type: "error",
        text1: `Please fill up the fields correctly!`,
      });
    }
    setIsLoading(true);
    const result = await axiosExtender("user/update/" + props?.credentials?._id, "put", profileDetails)
    if (result?.success) {
      storeHandler(profileDetails)
      loadHandler()
      useToast({
        type: "success",
        text1: "Update Successfuly!",
        onHide: () => {
        }
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
  };
  console.log(profileDetails, "")
  const FIELDS = [
    {
      name: "First Name",
      value: profileDetails?.first_name,
      onChange: (e) => setProfileDetails({ ...profileDetails, first_name: e }),
      role: "012"
    },
    {
      name: "Last Name",
      value: profileDetails?.last_name,
      onChange: (e) => setProfileDetails({ ...profileDetails, last_name: e }),
      role: "012"
    },
    {
      name: "Contact",
      value: profileDetails?.contact,
      onChange: (e) => setProfileDetails({ ...profileDetails, contact: e }),
      role: "0"
    },
    {
      name: "Email",
      value: profileDetails?.email,
      onChange: (e) => setProfileDetails({ ...profileDetails, email: e }),
      role: "012"
    },
    {
      name: "House No",
      value: profileDetails?.house_no,
      numberOfLines: 3,
      onChange: (e) => setProfileDetails({ ...profileDetails, house_no: e }),
      role: "0"
    },
    {
      name: "City",
      value: profileDetails?.city,
      onChange: (e) => setProfileDetails({ ...profileDetails, city: e }),
      role: "0"
    },
  ]
  const storeHandler = async (item) => {
    try {
      const user_session = await AsyncStorage.getItem("user");
      let newDetails = item
      let oldDetails = null
      if (user_session) {
        oldDetails = JSON.parse(user_session)
        props.setUserCredentials({ ...oldDetails, ...newDetails })
      }
      await AsyncStorage.setItem("user", JSON.stringify({ ...oldDetails, ...newDetails }));
    } catch (e) {
      console.log("Warning set in ProfileInformationPage.js: " + e);
    }
  };
  const loadHandler = () => {
    setIsLoading(true)
    const { first_name, last_name, email, contact, city, house_no } = props?.credentials
    let values = props?.credentials?.role == 0 ?
      { first_name, last_name, email, contact, city, house_no }
      :
      { first_name, last_name, email, }
    setProfileDetails({
      ...values
    })
    setIsLoading(false)
  }
  useEffect(() => {
    loadHandler()
  }, [props?.credentials])





  return (
    <ScrollViewLayout>
      <View className={`${enableUpdate ? "hidden" : "flex"} w-full flex-col items-center justify-center rounded-full`}>
        <View>
          {
            props?.credentials.profile_picture ?
              <Image source={{ uri: props?.credentials?.profile_picture }} style={styles.dp} />
              :
              <Image source={ICONS.PROFILE} style={styles.dp} />
          }
        </View>
        <Underline onPress={() => props?.navigation?.navigate("change-profile")}>Change Profile Picture</Underline>
      </View>
      {FIELDS.filter((d) => d.role.includes(props?.credentials?.role)).map((item, key) => (
        <FormFieldWrapper key={key}>
          <Label>{item?.name}:</Label>
          <InputText
            placeholder={item?.name}
            value={item?.value}
            onChange={(e) => item?.onChange(e)}
            numberOfLines={item?.numberOfLines}
            editable={item?.name == "Email" ? false : enableUpdate ? !isLoading : false} />
        </FormFieldWrapper>
      ))}
      <MarginSpacer space={2} />
      <FormFieldWrapper>
        {
          !enableUpdate ?
            <PrimaryFullButton onPress={() => setEnableUpdate(true)}>
              Edit Information
            </PrimaryFullButton>
            :
            <>
              <PrimaryFullButton onPress={saveHandler}>
                {isLoading ? "Saving..." : "Save Changes"}
              </PrimaryFullButton>
              {!isLoading &&
                <>
                  <MarginSpacer space={2} />
                  <PrimaryFullButton custom="bg-slate-300 text-black"
                    onPress={() => setEnableUpdate(false)}
                  >
                    Cancel
                  </PrimaryFullButton>
                </>
              }
            </>
        }
      </FormFieldWrapper>
    </ScrollViewLayout >
  );
};

const mapStateToProps = (state) => {
  return {
    credentials: state?.user?.credentials
  }
}
export default connect(mapStateToProps, { setUserCredentials })(ProfileInformationPage);

const styles = StyleSheet.create(EXTERNALSTYLE)