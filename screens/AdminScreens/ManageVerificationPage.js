import { StyleSheet, Text, View } from "react-native";

import React, { useEffect, useState } from "react";
import {
  FlexHorizontalLayout,
  FormFieldWrapper,
  Heading2,
  Heading3,
  InputText,
  MarginSpacer,
  Paragraph,
  PrimaryFullButton,
  ScrollViewLayout,
  SimpleCard,
} from "../../components";
import { axiosExtender } from "../../config/axios_config";
import { connect } from "react-redux";

const ManageVerificationPage = (props) => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("Profile")
  const [data, setData] = useState([])
  const final_list = mode == "Profile" ? data.filter(
    (d) =>
      d?.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${d?.first_name?.toLowerCase()} ${d?.last_name.toLowerCase()}`.includes(search.toLowerCase())
  ) :
    data.filter((d) =>
      d?.user_id?.email?.toLowerCase().includes(search.toLowerCase()) ||
      (`${d?.user_id?.first_name?.toLowerCase()} ${d?.user_id?.last_name.toLowerCase()}`).includes(search.toLowerCase()))

  const profileLoadHandler = async () => {
    const result = await axiosExtender("user/find/role", "post", { account_status: 2, role: 0 })
    if (result?.success) {
      setData(result.data)
    }
  }

  useEffect(() => {
    profileLoadHandler()
  }, [mode, props.user_list])
  return (
    <ScrollViewLayout>
      <FormFieldWrapper>
        <InputText placeholder="Search here..." onChange={setSearch} />
      </FormFieldWrapper>
      <MarginSpacer space={2} />
      {final_list.length > 0 ? (
        final_list.map((item) => (
          <SimpleCard key={item?._id} onPress={() => {
            props?.navigation.navigate("admin-verification-crud", { item, mode })
          }}>
            <Paragraph>Email: {item?.email || item?.user_id?.email}</Paragraph>
            <Paragraph>Full Name: {item?.first_name || item?.user_id?.first_name} {item?.last_name || item?.user_id?.last_name}</Paragraph>
          </SimpleCard>
        ))
      ) : (
        <Paragraph> No result found</Paragraph>
      )}
    </ScrollViewLayout>
  );
};
const mapStateToProps = (state) => {
  return {
    user_list: state.user.user_list
  }
}


export default connect(mapStateToProps, {})(ManageVerificationPage);
const styles = StyleSheet.create({});
