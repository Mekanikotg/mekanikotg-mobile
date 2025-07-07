import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TabCard = ({ item, navigation, ...props }) => {
  const { icons, label } = item;
  return (
    <TouchableOpacity onPress={() => {
      try {

        if (item?.navigateTo)
          return navigation.navigate(item?.navigateTo)
        Alert.alert('Log out', 'Are you sure you want to log out?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', onPress: async () => {
              await AsyncStorage.removeItem("user");
              navigation.replace("login");
            }
          },
        ]);


      } catch (e) {
        console.log("Warning Occur in Home.js: " + e.message);
      }
    }}>
      <View
        className={` h-20 m-2 items-center rounded-2xl overflow-hidden border border-zinc-200 flex justify-center`}
        style={{ width: (Dimensions.get("screen").width - 81) / 3 }}
      >
        <Image source={icons} className="h-8 w-8 mb-2" />
        <Text className="text-center" style={{ fontSize: 10, fontFamily: "regular" }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default TabCard

