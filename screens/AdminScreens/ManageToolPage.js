import { ButtonWithIcon, FlexHorizontalLayout, FormFieldWrapper, Heading3, IdImage, Label, MarginSpacer, Paragraph, ScrollViewLayout } from "../../components";
import { setToolsList } from "../../redux"
import {
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";

import { axiosExtender } from "../../config/axios_config";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";

const ManageToolsPage = (props) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    const result = await axiosExtender("tools", "get")
    if (result?.success) {
      setData(result.data)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    load();
  }, [props?.tools_list])

  const addHandler = () => {
    props?.navigation.navigate("admin-tools-crud")
  }

  const modifyHandler = (item) => {
    props?.navigation?.navigate("admin-tools-crud", { item })
  }
  return <ScrollViewLayout>
    <FormFieldWrapper>
      {isLoading ?
        <Paragraph custom="text-center w-full">Fetching information...</Paragraph>
        :
        <>
          <FlexHorizontalLayout>
            <Heading3>Listed: {data?.length}</Heading3>
            <ButtonWithIcon
              wrapperCustom="bg-zinc-900 p-3"
              contentCustom="text-white text-md"
              onPress={addHandler}
              icon={ICONS.PLUS}
              text="Add Tools"
            />
          </FlexHorizontalLayout>
          {data.length > 0 ? (
            data.map((item, keys) => (
              <TouchableOpacity
                key={"tools-" + keys}
                onPress={() => modifyHandler(item)}>

                <View className="border-zinc-400">
                  <Label custom="py-0">Name: {item?.name}</Label>
                  <Label custom="py-0">Price: {item?.price}</Label>
                  <IdImage uri={item?.image} />
                </View>
                <MarginSpacer space={2} />
              </TouchableOpacity>
            ))
          ) : (
            <Paragraph>No tools listed</Paragraph>
          )}
        </>
      }
    </FormFieldWrapper>
  </ScrollViewLayout>;
};
const mapStateToProps = state => {
  return {
    tools_list: state.tools.tools_list
  }
}
export default connect(mapStateToProps, { setToolsList })(ManageToolsPage);

