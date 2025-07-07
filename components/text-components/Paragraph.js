import { StyleSheet, Text } from "react-native";
import React from "react";

const Paragraph = ({ children, custom, ...props }) => {
  return (
    <Text className={`text-black ${custom}`} style={{ fontFamily: "regular" }}>
      {children}
    </Text>
  );
};

export default Paragraph;

const styles = StyleSheet.create({});
