import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlexVerticalLayout, FormFieldWrapper, IdImage, Label, MarginSpacer, Paragraph, PrimaryFullButton, ScrollViewLayout } from '../../components'
import * as ImagePicker from "expo-image-picker";
import { axiosExtender } from '../../config/axios_config';
import useToast from '../../hooks/useToast';
import { uploadImages } from '../../utils/TOOLS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { setUserCredentials } from '../../redux';

const ProfileVerificationPage = (props) => {
    const [information, setInformation] = useState(null)
    const [selfieImage, setSelfieImage] = useState(null)
    const [idImage, setIdImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const imagePickerHandler = async (handler) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowEditing: true,
                quality: 1,
            });
            if (!result.canceled) {
                const source = { uri: result.assets[0].uri };
                handler(source);
            }
        } catch (e) {
            console.log(e)
        }
    };
    const storeHandler = async (item) => {
        try {
            const user_session = await AsyncStorage.getItem("user");
            let newDetails = item
            let oldDetails = null
            if (user_session) {
                oldDetails = JSON.parse(user_session)
                props.setUserCredentials({ ...oldDetails, ...newDetails })
            }
            await AsyncStorage.setItem("user", JSON.stringify({ ...oldDetails, ...newDetails }));
        } catch (e) {
            console.log("Warning set in ProfileInformationPage.js: " + e);
        }
    };
    
    const saveHandler = async () => {
        if (!selfieImage || !idImage)
            return useToast({ type: "error", text1: "Please upload the required requirements!" });
        setIsLoading(true)
        await uploadImages([selfieImage, idImage])
            .then(async (imageUrls) => {
                const newData = {
                    selfie_image_link: imageUrls[0],
                    id_image_link: imageUrls[1],
                    account_status: 2
                }
                const result = await axiosExtender("user/update/" + information?._id, "put", newData)
                if (result?.success) {
                    storeHandler({ ...information, ...newData })
                    useToast({
                        type: "success",
                        text1: "Verification is now submitted!",
                        onHide: () => {
                            props?.navigation.goBack()
                        }
                    });
                } else {
                    useToast({
                        type: "error",
                        text1: `Something went wrong or no internet connection!`,
                        onShow: () =>
                            setIsLoading(false)
                    });
                }
                console.log(result)
            })
            .catch((error) => {
                useToast({ type: "error", text1: "Something went wrong!" });
                setIsLoading(false)

            });

    }

    useEffect(() => {
        const data = props.route.params?.profileDetails;
        setInformation(data)
    }, [])

    return (
        <ScrollViewLayout>
            {information &&
                <>
                    <Label>Personal Information</Label>
                    <FlexVerticalLayout custom={'p-4 bg-slate-50 m-0'} dimensionCut={32}>
                        {Object.keys(information).slice(1)?.map((item, key) => (
                            <Paragraph key={item} custom={"capitalize"}>{item?.replace("_", " ")?.trim()}: {" "}{information[item]}</Paragraph>
                        ))}
                    </FlexVerticalLayout>
                    <MarginSpacer space={2} />
                    <FormFieldWrapper >
                        <Label>Upload selfie with valid ID:</Label>
                        <IdImage uri={selfieImage?.uri} />
                        {!isLoading && (
                            <>
                                <MarginSpacer space={2} />
                                <PrimaryFullButton custom="bg-slate-100 text-black"
                                    onPress={() => imagePickerHandler(setSelfieImage)}
                                >
                                    Choose Image
                                </PrimaryFullButton>
                            </>
                        )}
                    </FormFieldWrapper>
                    <MarginSpacer space={2} />
                    <FormFieldWrapper >
                        <Label>Front picture of valid ID:</Label>
                        <IdImage uri={idImage?.uri} />
                        {!isLoading && (
                            <>
                                <MarginSpacer space={2} />
                                <PrimaryFullButton custom="bg-slate-100 text-black"
                                    onPress={() => imagePickerHandler(setIdImage)}
                                >
                                    Choose Image
                                </PrimaryFullButton>
                            </>
                        )}
                        <MarginSpacer space={2} />

                        <PrimaryFullButton activeOpacity={isLoading} onPress={() => !isLoading && saveHandler()} >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </PrimaryFullButton>
                    </FormFieldWrapper>
                    <MarginSpacer space={2} />
                </>
            }

        </ScrollViewLayout>
    )
}

export default connect(null, { setUserCredentials })(ProfileVerificationPage)