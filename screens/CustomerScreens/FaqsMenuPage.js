import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  FormFieldWrapper,
  Heading2,
  Heading3,
  InputText,
  Label,
  MarginSpacer,
  Paragraph,
  ScrollViewLayout,
  SimpleCard,
  StartLayout,
} from "../../components";
import { DATA, ICONS } from "../../utils";
import { Image } from "expo-image";

const FaqsMenuPage = () => {
  const [currentIndex, sestCurrentIndex] = useState(null);
  const [search, setSearch] = useState("");
  const faqs_list = DATA.CUSTOMERHOMESCREEN.FAQS.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <ScrollViewLayout>
      <Heading3 custom={"mb-6"}>
        We can help you answer your queries by connecting to our live agent.
      </Heading3>
      <MarginSpacer space={2} />
      <FormFieldWrapper>
        <InputText placeholder="Search here..." onChange={setSearch} />
      </FormFieldWrapper>
      <MarginSpacer space={2} />
      {faqs_list.length > 0 ? (
        faqs_list.map((item, key) => (
          <SimpleCard key={"faqs" + key}>
            <TouchableOpacity
              onPress={() =>
                key == currentIndex
                  ? sestCurrentIndex(null)
                  : sestCurrentIndex(key)
              }
            >
              <View className="flex items-center justify-between flex-row">
                <Heading3>{item?.title}</Heading3>
                <Image
                  source={
                    currentIndex == key ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN
                  }
                  className="h-6 w-6"
                />
              </View>
              {currentIndex == key && (
                <View className="my-2">
                  <Paragraph>{item?.description}</Paragraph>
                </View>
              )}
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

export default FaqsMenuPage;

const styles = StyleSheet.create({});
