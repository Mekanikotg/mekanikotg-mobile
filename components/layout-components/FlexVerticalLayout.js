import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Dimensions } from "react-native";

const FlexVerticalLayout = ({ children, dimensionCut, custom}) => {
  return (
    <View
      style={{ width: (Dimensions.get("screen").width - (dimensionCut || 48)) / 1 }}
      className={` flex items-start justify-between border border-slate-200 bg-slate-100 p-4 rounded-md m-2 ${custom}`}
    >
      {children}
    </View>
  );
};

export default FlexVerticalLayout;

const styles = StyleSheet.create({});
