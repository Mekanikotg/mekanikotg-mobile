import { StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import {
  FlexHorizontalLayout,
  FormFieldWrapper,
  Heading3,
  InputText,
  MarginSpacer,
  Paragraph,
  ScrollViewLayout,
  ButtonWithIcon,
  SimpleCard,
} from "../../components";
import { useEffect } from "react";
import { setSelectedTowing, setTowingList } from "../../redux"
import { axiosExtender } from "../../config/axios_config";
import { connect } from "react-redux";
const ManageTowingPage = (props) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const addHandler = () => {
    props?.navigation.navigate("admin-towing-crud")
    props?.setSelectedTowing(null)
  }
  const load = async () => {
    const result = await axiosExtender("towing", "get")
    if (result?.success) {
      props?.setTowingList(result.data);
      setData(result.data)
    }
    setIsLoading(false)
  }
  const towing_list = data.filter(
    (d) =>
      d.company_name.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase())

  );
  useEffect(() => {
    load()
  }, [props?.modify_done])
  const modifyHandler = (item) => {
    props?.setSelectedTowing(item)
    props?.navigation?.navigate("admin-towing-crud")
  }
  return (
    <ScrollViewLayout>
      <FormFieldWrapper>
        <InputText placeholder="Search here..." onChange={setSearch} />
      </FormFieldWrapper>
      <MarginSpacer space={2} />
      {isLoading ?
        <Paragraph custom="text-center w-full">Fetching information...</Paragraph>
        :
        <>

          <FlexHorizontalLayout>
            <Heading3>Listed: {towing_list?.length}</Heading3>
            <ButtonWithIcon
              wrapperCustom="bg-zinc-900 p-3"
              contentCustom="text-white text-md"
              onPress={addHandler}
              icon={ICONS.PLUS}
              text="Add Company"
            />
          </FlexHorizontalLayout>
          {towing_list.length > 0 ? (
            towing_list.map((item, key) => (
              <SimpleCard key={"towing" + key} onPress={() => modifyHandler(item)}>
                <Paragraph>Email: {item?.company_name}</Paragraph>
                <Paragraph>Full Name: {item?.contact}</Paragraph>
                <Paragraph>City: {item?.city}</Paragraph>
              </SimpleCard>
            ))
          ) : (
            <Paragraph>{search.trim().length > 0 ? "Towing not found" : "No towing company listed"}</Paragraph>
          )}
        </>
      }
    </ScrollViewLayout>
  );
};
const mapStateToProps = state => {
  return {
    modify_done: state.towing.modify_done,
    towing_list: state.towing.towing_list
  }
}
export default connect(mapStateToProps, { setSelectedTowing, setTowingList })(ManageTowingPage);

const styles = StyleSheet.create({});
