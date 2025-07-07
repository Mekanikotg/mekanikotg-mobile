import { ButtonWithIcon, FlexHorizontalLayout, FormFieldWrapper, Heading3, Paragraph, ScrollViewLayout } from "../../components";

import { setSelectedNews, setNewsList } from "../../redux"
import {
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";

import { axiosExtender } from "../../config/axios_config";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";

const ManageNewsPage = (props) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    const result = await axiosExtender("news/", "get")
    if (result?.success) {
      props?.setNewsList(result?.data)
      setData(result.data)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    load();
  }, [props?.modify_done])

  const addHandler = () => {
    props?.navigation.navigate("admin-news-crud")
    props?.setSelectedNews(null)
  }

  const modifyHandler = (item) => {
    props?.setSelectedNews(item)
    props?.navigation?.navigate("admin-news-crud")
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
              text="Add News"
            />
          </FlexHorizontalLayout>
          {data.length > 0 ? (
            data.map((item, keys) => (
              <TouchableOpacity
                key={"news-" + keys}
                onPress={() => modifyHandler(item)}>
                <Image
                  className="mb-4 rounded-md w-full bg-slate-100"
                  style={[
                    {
                      aspectRatio: 16 / 9,
                      resizeMode: "cover",
                    },
                  ]}
                  source={{
                    uri:
                      item?.image
                  }}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Paragraph>No news listed</Paragraph>
          )}
        </>
      }
    </FormFieldWrapper>
  </ScrollViewLayout>;
};
const mapStateToProps = state => {
  return {
    modify_done: state.news.modify_done,
    news_list: state.news.news_list
  }
}
export default connect(mapStateToProps, { setSelectedNews, setNewsList })(ManageNewsPage);

