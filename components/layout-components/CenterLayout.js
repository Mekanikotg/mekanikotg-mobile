import { Dimensions, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../../utils";

const CenterLayout = ({ children, ...props }) => {
  return (
    <>
      <StatusBar backgroundColor={COLORS.green} barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ minHeight: Dimensions.get("window").height }} keyboardShouldPersistTaps="handled">
        <View
          className={`flex bg-white h-full p-4 items-center justify-center ${props?.classContainer}`}
          {...props}
        >
          {children}
        </View>
      </ScrollView>
    </>
  );
};

export default CenterLayout;

const styles = StyleSheet.create({});
