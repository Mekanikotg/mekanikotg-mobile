import { View, Text, Image } from 'react-native'
import React from 'react'
import Paragraph from '../text-components/Paragraph'
import FlexHorizontalLayout from '../layout-components/FlexHorizontalLayout'
import { DATA } from '../../utils'

const ToolCard = ({ items }) => {
    return (
        <View>
            {items?.map((item) => (
                <View className="border border-zinc-200 p-2 w-full flex flex-row items-start" key={item?._id}>
                    <Image source={{ uri: item?.image }} className="aspect-square h-10" />
                    <View>
                        <Paragraph>{item?.name}</Paragraph>
                        <Paragraph>{DATA.PESO} {item?.price}</Paragraph>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default ToolCard