import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { setNewsList } from "../../redux"
import React, { useRef } from "react";
import Paragraph from "../text-components/Paragraph";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useState } from "react";
import { axiosExtender } from "../../config/axios_config";

const width = Dimensions.get("screen").width - 46;

const NewsLayout = (props) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const load = async () => {
    const result = await axiosExtender("news", "get")
    if (result?.success) {
      props?.setNewsList(result?.data)
      setData(result.data)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    load()
  }, [props?.modify_done])
  return (
    <>
      <View
        className="m-2 border border-zinc-200 rounded-3xl overflow-hidden"
        style={{
          width,
        }}
      >
        {isLoading ?
          <Paragraph custom="text-center w-full p-20">Loading...</Paragraph>
          : data?.length == 0 ?
            <Paragraph custom="p-20 text-center w-full">No news for today!</Paragraph>
            :
            <FlatList
              data={data}
              horizontal
              scrollEventThrottle={32}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              pagingEnabled
              renderItem={({ item }) => (
                <Image
                  className="bg-slate-100"
                  style={{
                    width: width - 2,
                    aspectRatio: 16 / 9,

                    // height: ((width - 2) / 16) * 9,
                    resizeMode: "cover",
                  }}
                  source={{ uri: item.image }}
                />
              )}
            />
        }
      </View>
      <Indicator scrollX={scrollX} data={data} />
    </>
  );
};

const Indicator = ({ scrollX, data }) => {
  return (
    <View className="flex items-center justify-center flex-row  w-full">
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {data?.map((_, i) => {
          const inputRange = [
            (i - 3) * width,
            (i - 2) * width,
            (i - 1) * width,
            i * width,
            (i + 1) * width,
            (i + 2) * width,
            (i + 3) * width,
          ];
          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: [
              "#e2e8f0",
              "#e2e8f0",
              "#e2e8f0",
              "black",
              "#e2e8f0",
              "#e2e8f0",
              "#e2e8f0",
            ],
          });
          return (
            <Animated.View
              key={`indicator-${i}`}
              style={[{ backgroundColor }]}
              className="h-2 w-2 rounded-full m-2 border border-slate-900"
            />
          );
        })}
      </View>
    </View>
  );
};
const mapStateToProps = state => {
  return {
    modify_done: state.news.modify_done,
  }
}

export default connect(mapStateToProps, { setNewsList })(NewsLayout);

const styles = StyleSheet.create({});
