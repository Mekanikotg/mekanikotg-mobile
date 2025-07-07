import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const PrimaryFullButton = ({ children, ...props }) => {
  return (
    <TouchableOpacity {...props}
      activeOpacity={props?.activeOpacity ? 1 : .8}
    >
      <Text
        className={`text-white text-center p-4 rounded-md w-full bg-emerald-400  ${props?.custom}`}
        style={{ fontFamily: "semibold" }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryFullButton;

const styles = StyleSheet.create({});
