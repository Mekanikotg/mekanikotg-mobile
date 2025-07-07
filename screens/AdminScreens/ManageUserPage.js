import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  FlexHorizontalLayout,
  FormFieldWrapper,
  Heading2,
  Heading3,
  InputText,
  MarginSpacer,
  Paragraph,
  ScrollViewLayout,
  SimpleCard,
} from "../../components";
import { setSelectedUser, setUserList } from "../../redux"
import { useEffect } from "react";
import { axiosExtender } from "../../config/axios_config";
import { connect } from "react-redux";

const ManageUserPage = (props) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const user_list = data.filter(
    (d) =>
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      (d?.first_name.toLowerCase() + d?.last_name.toLowerCase()).includes(search.toLowerCase())
  );
  const load = async () => {
    const result = await axiosExtender("user/find/role", "post", { role: 0 })
    if (result?.success) {
      setData(result.data)
    }
    setIsLoading(false)
  }
  const modifyHandler = (item) => {
    props?.setSelectedUser(item)
    props?.navigation?.navigate("admin-user-crud")
  }
  useEffect(() => {
    load()
  }, [props?.modify_done])
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
            <Heading3>Listed: {user_list?.length}</Heading3>
          </FlexHorizontalLayout>
          {user_list.length > 0 ? (
            user_list.map((item, keys) => (
              <SimpleCard key={"user" + keys} onPress={() => modifyHandler(item)}>
                <Paragraph>Name: {item?.first_name} {item?.last_name}</Paragraph>
                <Paragraph>Email: {item?.email}</Paragraph>
                <Paragraph>Role: {item?.applicant_id?.status == 1 ? (item?.applicant_id?.account_type == 0 ? "Mechanic" : "Locksmith") : "Customer"}</Paragraph>
                <Paragraph>Account Status:{" "}
                  <View className={`mb-1 p-1 ${item.is_deleted ? "bg-red-500" : "bg-emerald-500"} rounded-full`}></View>{" "}{item?.is_deleted ? "InActive" : "Active"}</Paragraph>
              </SimpleCard>
            ))
          ) : (
            <Paragraph>{search.trim().length > 0 ? "Customer not found" : "No customer listed"}</Paragraph>
          )}
        </>
      }
    </ScrollViewLayout >
  );
};
const mapStateToProps = state => {
  return {
    modify_done: state.user.modify_done,
    user_list: state.user.user_list
  }
}
export default connect(mapStateToProps, { setSelectedUser, setUserList })(ManageUserPage);

const styles = StyleSheet.create({});
