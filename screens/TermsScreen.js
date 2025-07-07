import { View, Text, ScrollView } from "react-native";
import React from "react";
import { DATA } from "../utils";
import { Heading1, Label, PrimaryFullButton } from "../components";

const TermsScreen = (props) => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <View className="p-4 justify-center flex-col items-center">
          {/* header */}
          <Heading1>Terms and Conditions</Heading1>
          <Label className="font">
            Welcome to MEKANIKOTG, your go-to app for booking mechanics and
            locksmiths on demand. By using our app, you agree to the following
            terms:
          </Label>
          {/* conditions  */}
          <View>
            {DATA.TERMS_AND_CONDITIONS.map((item, key) => (
              <Label key={`conditions-${key}`}>
                {key + 1}. {item}
              </Label>
            ))}
          </View>
          {/* footer  */}
          <Label>
            By using MEKANIKOTG, you agree to these terms and conditions.
          </Label>
          <PrimaryFullButton onPress={() => props?.navigation.goBack()}>
            I understand and back to register
          </PrimaryFullButton>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsScreen;
