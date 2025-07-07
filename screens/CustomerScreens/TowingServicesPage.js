import {
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  ToastAndroid,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  FormFieldWrapper,
  Heading3,
  InputText,
  MarginSpacer,
  Paragraph,
  ScrollViewLayout,
  ButtonWithIcon,
  SimpleCard,
} from "../../components";
import * as Clipboard from "expo-clipboard";
import { DATA, ICONS } from "../../utils";
import { useEffect } from "react";
import { axiosExtender } from "../../config/axios_config";

const TowingServicesPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const dialNumber = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url)
      .then(() => console.log(`Dialing ${phoneNumber}`))
      .catch((error) =>
        console.error(`Failed to dial ${phoneNumber}: ${error}`)
      );
  };
  const load = async () => {
    const result = await axiosExtender("towing", "get")
    if (result?.success) {
      setData(result.data)
    }
  }
  const towing_list = data.filter(
    (d) => d.company_name.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    load()
  }, [])
  return (
    <ScrollViewLayout>
      <FormFieldWrapper>
        <InputText placeholder="Search here..." onChange={setSearch} />
      </FormFieldWrapper>
      <MarginSpacer space={2} />
      {towing_list.length > 0 ? (
        towing_list.map((item, key) => (
          <SimpleCard key={"towing" + key}>
            <TouchableOpacity onPress={() => dialNumber(item.contact)}>
              <Heading3>{item?.company_name}</Heading3>
              <Paragraph custom={"text-lg mb-2"}>{item?.contact}</Paragraph>
              <View className="flex items-center gap-2 flex-row justify-around">
                <ButtonWithIcon
                  wrapperCustom="bg-zinc-200"
                  onPress={() => {
                    copyToClipboard(item.contact);
                    ToastAndroid.show(
                      "Copied! Successfuly!",
                      ToastAndroid.SHORT
                    );
                  }}
                  icon={ICONS.CLIPBOARD}
                  text="Copy to Clipboard"
                />
                <ButtonWithIcon
                  wrapperCustom="bg-zinc-200"
                  onPress={() => dialNumber(item.contact)}
                  icon={ICONS.TELEPHONE_CALL}
                  text="Call Number"
                />
              </View>
            </TouchableOpacity>
          </SimpleCard>
        ))
      ) : (
        <Paragraph> No result found</Paragraph>
      )}
      <MarginSpacer space={6} />
    </ScrollViewLayout>
  );
};

export default TowingServicesPage;

const styles = StyleSheet.create({});
