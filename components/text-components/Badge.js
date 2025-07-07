import { Text, View } from 'react-native'
import React from 'react'

const Badge = ({ children, custom, ...props }) => {
    return (
        <Text className={`rounded-full px-2 py-[2px] text-[10px] ${custom}`} style={{ fontFamily: "regular" }}>
            {children}
        </Text>
    );
};

export default Badge
