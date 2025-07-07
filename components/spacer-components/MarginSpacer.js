import { StyleSheet, Text, View } from "react-native";
import React from "react";

const MarginSpacer = ({ space }) => {
  return <View className={`m-${space}`} />;
};

export default MarginSpacer;
