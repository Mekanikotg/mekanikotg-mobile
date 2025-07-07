import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Heading1 = ({ children }) => {
  return (
    <Text className="text-4xl" style={{ fontFamily: "semibold" }}>
      {children}
    </Text>
  );
};

export default Heading1;
