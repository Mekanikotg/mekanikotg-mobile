import React, { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { axiosExtender } from "../../config/axios_config";
import {
  ScrollViewLayout,
  FormFieldWrapper,
  Paragraph,
  MarginSpacer,
  Label,
  IdImage,
  PrimaryFullButton,
  Heading3,
} from "..";
import { DATA } from "../../utils";
import { connect } from "react-redux";
import connectSocket from "../../config/socket_config";
import { setActiveBooking } from "../../redux";

const ToolsBookingPage = (props) => {
  const { height } = Dimensions.get("screen")
  const socket = connectSocket();
  const [isDone, setIsDone] = useState(false)
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const load = async () => {
    const result = await axiosExtender("tools", "get");
    if (result?.success) {
      let temp = result.data.filter((d) => d.type === props?.bookingData?.service_type)
      setData(temp);
    }
    socket.emit("join_room", props?.bookingData?._id + "_booking");
    setIsLoading(false);
  };
  // asd 
  useEffect(() => {
    load();
  }, []);
  const [tools, setTools] = useState([])
  const addToolsHandler = (item) => {
    let temp = tools.filter(t => t?._id == item?._id)
    if (temp?.length > 0)
      setTools(tools.filter(t => t?._id != item?._id))
    else {
      setTools([...tools, item])
    }
  };

  const selectHandler = (item) => {
    return tools?.filter(t => t?._id == item?._id).length > 0 ? "bg-zinc-900 text-white" : ""
  }

  const paidHandler = async () => {
    const newTools = tools.map((i) => ({ name: i.name, price: i.price, image: i.image }))
    props?.setIsLoading(true)
    const result = await axiosExtender("booking/update/" + props?.bookingData?._id, "put", { status: "completed", tools_used: [...newTools] })
    if (result?.success) {
      const messageData = {
        room: props?.bookingData?._id + "_booking", // Replace with the actual shared room name
        message: { ...props?.bookingData, ...result?.data },
      };
      socket.emit("send_user_booking", messageData)
      setIsDone(true)
      props?.setBooking(false)
      props?.setActiveBooking(null)
    }
    props?.setIsLoading(false)
  }
  return (
    <View style={{ flex: 1, height: "auto" }}>
      <ScrollViewLayout>
        {/* <FormFieldWrapper> */}
        {!isDone ?
          <>
            {isLoading ? (
              <Paragraph custom="text-center w-full">Fetching information...</Paragraph>
            ) : (
              <View className=" w-full flex flex-row flex-wrap ">
                {data.length > 0 ? (
                  data.map((item, keys) => (
                    <TouchableOpacity
                      key={"tools-" + keys}
                      onPress={() => addToolsHandler(item)}
                      style={{
                        width: "50%",
                      }}
                    >
                      <View className={`${selectHandler(item)} p-2 border-zinc-200 rounded-md border`}>
                        <Label custom={`${selectHandler(item)} py-0`}>Name: {item?.name}</Label>
                        <Label custom={`${selectHandler(item)} py-0`}>{DATA.PESO} {item?.price}</Label>
                        <IdImage uri={item?.image} />
                      </View>
                      <MarginSpacer space={2} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Paragraph>No tools listed</Paragraph>
                )}
              </View>
            )}
          </>
          :
          <View className="py-10 w-full flex my-auto ">
            <Heading3 custom="text-center">Thank you for providing quality services to our customers.</Heading3>
            <MarginSpacer space={2} />
            <Paragraph custom="text-center">We are thankful that we have you helping customers on their needs.</Paragraph>
            <MarginSpacer space={2} />
            <FormFieldWrapper>
              <PrimaryFullButton custom="bg-zinc-900" onPress={() => {
                props?.navigation?.goBack()
              }}>Return Home</PrimaryFullButton>
            </FormFieldWrapper>
          </View>
        }
      </ScrollViewLayout>
      {!isDone &&
        <View className="w-full p-2 bg-white">
          {tools?.length > 0 ?
            <>
              {tools.map((item) => (
                <View
                  key={item?._id}
                >
                  <View className="w-full justify-between flex flex-row">
                    <Paragraph>{item?.name}</Paragraph>
                    <Paragraph>{DATA.PESO} {item?.price}</Paragraph>
                  </View>
                </View>

              ))}
              <View className="w-full justify-between flex flex-row">
                <Paragraph>Sub Total: </Paragraph>
                <Paragraph>
                  {DATA.PESO}{" "}
                  {tools.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0)}
                </Paragraph>
              </View>
              <View className="w-full justify-between flex flex-row">
                <Paragraph>Arrival Price: </Paragraph>
                <Paragraph>
                  {DATA.PESO}{" "}
                  {Number(props?.bookingData?.pre_price)}
                </Paragraph>
              </View>
              <View className="w-full justify-between flex flex-row">
                <Paragraph>Total: </Paragraph>
                <Paragraph>
                  {DATA.PESO}{" "}
                  {tools.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0) + Number(props?.bookingData?.pre_price)}
                </Paragraph>
              </View>
            </>
            :
            <Paragraph custom="py-4">No tools selected</Paragraph>
          }
          <PrimaryFullButton onPress={paidHandler}>
            Mark as Paid
          </PrimaryFullButton>

        </View>
      }
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    data: state?.booking?.data,
  }
}
export default connect(mapStateToProps, { setActiveBooking })(ToolsBookingPage);
