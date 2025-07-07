import { Text } from "react-native";
import React from "react";

const Heading2 = ({ children, custom }) => {
  return (
    <Text
      className={`m-2 text-2xl ${custom}`}
      style={{ fontFamily: "semibold" }}
    >
      {children}
    </Text>
  );
};

export default Heading2;
