import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Label = ({ custom, children }) => {
  return (
    <Text className={`py-2 text-left ${custom}`} style={{ fontFamily: "regular" }}>
      {children}
    </Text>
  );
};

export default Label;

const styles = StyleSheet.create({});
