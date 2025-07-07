import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Badge, FlexHorizontalLayout, FlexVerticalLayout, MarginSpacer, Paragraph, ScrollViewLayout } from '../../components'
import { connect } from 'react-redux'
import { Image } from 'react-native'
import EXTERNALSTYLE from '../../utils/EXTERNALSTYLE'
import { ICONS } from '../../utils'
import { TouchableOpacity } from 'react-native'
import { badgeStatus } from '../../utils/TOOLS'

const ProfileMenuPage = (props) => {
    const { _id, first_name, last_name, profile_picture, email, contact, house_no, account_status } = props?.credentials
    const NAVIGATE_LINKS = [
        {
            label: "Verify Account", link: () => props?.navigation.navigate("customer-profile-verification", {
                profileDetails: {
                    _id, first_name, last_name, email, contact, house_no
                }
            })
        },
        { label: "Edit Information", link: () => props?.navigation.push("customer-profile-information") },
        { label: "Change Password", link: () => props?.navigation.push("customer-profile-password") },

    ].slice((account_status > 0 || props?.credentials?.role > 0) && 1)

    return (
        <ScrollViewLayout>
            <View className={`flex w-full flex-col items-center justify-center`}>
                <FlexVerticalLayout custom="bg-zinc-100 border-0 p-6 rounded-3xl items-center">
                    {
                        profile_picture ?
                            <Image source={{ uri: profile_picture }} style={styles.dp2} className="object-cover" />
                            :
                            <Image source={ICONS.PROFILE} style={styles.dp2} className="object-cover" />
                    }
                    <MarginSpacer space={2} />
                    {props?.credentials?.role == 0 &&
                        <View className="flex">
                            <Badge custom=" bg-white">{badgeStatus(account_status)}</Badge>
                        </View>
                    }
                </FlexVerticalLayout>
                <FlexHorizontalLayout>
                    <Paragraph>Name: </Paragraph>
                    <Paragraph>{first_name} {last_name}</Paragraph>
                </FlexHorizontalLayout>
                <FlexHorizontalLayout>
                    <Paragraph>Email: </Paragraph>
                    <Paragraph>{email}</Paragraph>
                </FlexHorizontalLayout>
                {NAVIGATE_LINKS.map((item, key) => (
                    <TouchableOpacity onPress={item?.link} key={"profile-menu" + key}>
                        <FlexHorizontalLayout>
                            <Paragraph>{item?.label}</Paragraph>
                            <Image source={ICONS.ARROWRIGHT} style={styles.arrow_right} />
                        </FlexHorizontalLayout>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollViewLayout>
    )
}

const mapStateToProps = (state) => {
    return {
        credentials: state?.user?.credentials
    }
}

export default connect(mapStateToProps, {})(ProfileMenuPage);

const styles = StyleSheet.create(EXTERNALSTYLE)
