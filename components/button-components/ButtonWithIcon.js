import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Paragraph from "../text-components/Paragraph";

const ButtonWithIcon = (props) => {
  const { contentCustom, wrapperCustom, icon, text, onPress } = props
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.7}>
      <View
        className={` p-2 bg-slate-500 flex rounded-md flex-row  items-center justify-center ${wrapperCustom}`}
      >
        <Image source={icon} className="w-6 h-6 mr-2" />
        <Paragraph custom={contentCustom}>{text}</Paragraph>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonWithIcon;

