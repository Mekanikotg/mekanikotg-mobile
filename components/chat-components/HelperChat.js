import { View, Text } from 'react-native'
import React from 'react'
import Paragraph from '../text-components/Paragraph'
import MarginSpacer from '../spacer-components/MarginSpacer'

const HelperChat = () => {
    return <>
    <View className="flex flex-row items-center justify-start">
        <Paragraph custom="p-1 rounded-lg px-3 bg-zinc-200">{message}</Paragraph>
    </View>
    <MarginSpacer space={2} />
</>
}

export default HelperChat