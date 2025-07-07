import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Children } from "react";

const SimpleCard = ({ children, onPress }) => {
  return (
    <View className="w-full rounded-md my-2 bg-slate-100 border border-slate-200">
      <TouchableOpacity activeOpacity={.5} onPress={onPress}>
        <View className="p-4">
          {children}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SimpleCard;

const styles = StyleSheet.create({});
