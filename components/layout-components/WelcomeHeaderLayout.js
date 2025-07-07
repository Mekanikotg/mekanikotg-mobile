import { StyleSheet, View } from 'react-native'
import React from 'react'
import FlexHorizontalLayout from './FlexHorizontalLayout'
import { ICONS } from '../../utils'
import Paragraph from '../text-components/Paragraph'
import Heading3 from '../text-components/Heading3'
import Badge from '../text-components/Badge'
import EXTERNALSTYLE from '../../utils/EXTERNALSTYLE'
import { Image } from 'react-native'
import { badgeStatus } from '../../utils/TOOLS'

const WelcomeHeaderLayout = (props) => {
    console.log(props?.data?.applicant_id?.status)
    return (
        <FlexHorizontalLayout custom="justify-start  bg-zinc-200 p-4">
            <View>
                {
                    props?.data?.profile_picture ?
                        <Image source={{ uri: props?.data.profile_picture }} style={styles.dp} />
                        :
                        <Image source={ICONS.PROFILE} style={styles.dp} />
                }
            </View>
            <View className="p-4  flex-1">
                <Paragraph custom="">Hello, {props?.role == 1 ? "Mechanic" : props?.role == 2 && "Admin"} {props?.data?.applicant_id?.status == 1 && (props?.data?.applicant_id?.account_type == 0 ? "Mechanic" : "Locksmith")}</Paragraph>
                <Heading3 custom="text-lg ">{props?.data?.first_name}</Heading3>
                {props?.role == 0 &&
                    <View className="items-start">
                        <Badge custom=" bg-white">{badgeStatus(props?.data?.account_status)}</Badge>
                    </View>
                }
            </View>

        </FlexHorizontalLayout>
    )
}

export default WelcomeHeaderLayout


const styles = StyleSheet.create(EXTERNALSTYLE)
