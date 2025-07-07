import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";

const InputPassword = ({ ...props }) => {
  return (
    <View className="relative flex items-center justify-center">
      <TextInput
        className="w-full py-3 px-4 border border-zinc-200 rounded-md"
        style={{ fontFamily: "regular" }}
        {...props}
      />
      <View className="absolute right-0">
        <TouchableOpacity activeOpacity={props?.editable ? 1 : .7} onPress={() =>
          props?.editable &&
          props?.hideHandler()}>
          <Text className=" p-4" style={{ fontFamily: "regular" }}>
            {props?.secureTextEntry ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputPassword;
