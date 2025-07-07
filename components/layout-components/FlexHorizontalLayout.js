import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FlexHorizontalLayout = ({ children, custom, dimensionCut }) => {
    return (
        <View
            style={{ width: (Dimensions.get("screen").width - (dimensionCut || 48)) / 1 }}
            className={`flex items-center flex-row justify-between rounded-3xl m-2 ${custom}`}
        >
            {children}
        </View>
    );
};

export default FlexHorizontalLayout

const styles = StyleSheet.create({})