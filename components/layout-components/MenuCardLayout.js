import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import TabCard from "../card-components/TabCard";
import { connect } from "react-redux";

const MenuCardLayout = ({ data, navigation, handler, ...props }) => {

  return (
    <View className="flex flex-row flex-wrap">
      {data?.map((item, key) => {
        return (
          <TabCard
            key={item?.label + key}
            item={item}
            navigation={navigation} />
        )
      }
      )}
    </View>
  );
};
export default MenuCardLayout
