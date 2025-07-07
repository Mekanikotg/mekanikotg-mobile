import { View, Text } from 'react-native'
import React from 'react'
import MarginSpacer from '../spacer-components/MarginSpacer'
import Paragraph from '../text-components/Paragraph'

const CustomerChat = ({ message }) => {
    return (
        <>
            <View className="flex flex-row items-center justify-end">
                <Paragraph custom=" p-1 rounded-lg px-3 text-white bg-zinc-900 w-auto">{message}</Paragraph>
            </View>
            <MarginSpacer space={2} />
        </>
    )
}

export default CustomerChat