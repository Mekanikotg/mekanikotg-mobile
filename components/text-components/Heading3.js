import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Heading3 = ({ children,custom }) => {
  return (
    <Text className={`text-lg flex-shrink ${custom}`} style={{ fontFamily: "semibold" }}>
      {children}
    </Text>
  );
};

export default Heading3;
