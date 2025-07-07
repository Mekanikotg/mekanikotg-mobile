import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const Underline = ({ children, ...props }) => {
  return (
    <TouchableOpacity {...props} activeOpacity={props?.activeOpacity ? 1 : .8}>
      <Text
        className={`w-full py-2 text-md text-center underline ${props?.custom}`}
        style={{ fontFamily: "regular" }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Underline;

const styles = StyleSheet.create({});
