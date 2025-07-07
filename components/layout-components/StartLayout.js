import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { StatusBar } from "react-native";

const StartLayout = ({ children, ...props }) => {
  return (
    <SafeAreaView>
      <StatusBar />
      <View className="p-4 flex bg-white h-full items-start" {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default StartLayout;

const styles = StyleSheet.create({});
