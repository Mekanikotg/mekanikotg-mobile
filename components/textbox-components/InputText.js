import React from "react";
import { TextInput } from "react-native";

const InputText = ({ custom, ...props }) => {
  return (
    <TextInput
      className={`w-full p-3 px-4 border rounded-md border-zinc-200 ${custom}`}
      style={{ fontFamily: "regular" }}
      onChangeText={(e) => props?.onChange(e)}

      {...props}
    />
  );
};

export default InputText;

