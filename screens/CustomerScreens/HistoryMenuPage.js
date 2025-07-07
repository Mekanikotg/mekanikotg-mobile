import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Heading3, Paragraph, ScrollViewLayout, StartLayout, ToolCard } from "../../components";
import { useState } from "react";
import { axiosExtender } from "../../config/axios_config";
import { useEffect } from "react";
import { connect } from "react-redux";
import { DATA } from "../../utils";

const HistoryMenuPage = (props) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHandler()
  }, [props?.credentials])
  const loadHandler = async () => {
    const result = await axiosExtender("booking", "get")
    if (result?.success) {
      setData(result.data.filter(d => d.status == "completed" &&
        (d.client_id?._id == props?.credentials?._id || d.driver_id?._id == props?.credentials?._id)))
      setIsLoading(false)
    }
  }
  return <ScrollViewLayout>
    {isLoading ?
      <Paragraph custom="text-center w-full">Fetching information...</Paragraph>
      :
      data?.length > 0 ?
        data.map((item) => (
          <View key={item?._id} className="border border-zinc-100 rounded-md p-2 mb-4 w-full">
            {props?.credentials?._id == item?.driver_id?._id &&
              <Heading3 custom="text-white rounded-lg p-2 mb-2 bg-emerald-500 text-center">Service</Heading3>
            }
            <Paragraph>Customer Name: {item?.client_id?.first_name} {item?.client_id?.last_name}</Paragraph>
            <Paragraph>Mechanic Name: {item?.driver_id?.first_name} {item?.driver_id?.last_name}</Paragraph>
            <Paragraph>Distance: {item?.distance} Km</Paragraph>

            <Paragraph>Arrival Price: {DATA.PESO} {item?.pre_price}</Paragraph>
            {item?.tools_used.length > 0 &&
              <ToolCard items={item?.tools_used} />
            }
            <Paragraph>
              Tools Price: {DATA.PESO} {
                (item?.tools_used || []).reduce((acc, tool) => acc + (parseFloat(tool.price) || 0), 0)
              }
            </Paragraph>
            <Paragraph>
              Overall Price: {DATA.PESO} {
                (item?.tools_used || []).reduce((acc, tool) => acc + (parseFloat(tool.price) || 0), 0) + Number(item?.pre_price)
              }
            </Paragraph>
            {item?.star > 0 &&
              <>
                <Paragraph>Star Rating:</Paragraph>

                <View className="flex-row justify-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Image key={`star-${i}`} source={item?.star < i ? ICONS.STAR : ICONS.STARFILLED} className="m-2" style={{ width: 40, height: 40 }} />
                  ))}
                </View>
              </>}
            {item?.comment && <Paragraph custom="">Comments: {item?.comment}</Paragraph>}
            <Paragraph>Status: {item?.status.toUpperCase()}</Paragraph>
          </View>
        ))
        : <Paragraph custom="text-center w-full py-10">No history.</Paragraph>
    }

  </ScrollViewLayout>;
};

const mapStateToProps = (state) => {
  return {
    credentials: state?.user?.credentials,
  }
}
export default connect(mapStateToProps, {})(HistoryMenuPage);

const styles = StyleSheet.create({});
