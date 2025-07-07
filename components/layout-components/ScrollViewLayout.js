import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { COLORS } from "../../utils";
const ScrollViewLayout = ({ children, ...props }) => {
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <StatusBar backgroundColor={COLORS.green} barStyle="dark-content" />
      <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: "white" }} className="min-h-full">
        <View className="p-4 flex bg-white h-full items-start" {...props}>
          {children}
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default ScrollViewLayout;

const styles = StyleSheet.create({});
