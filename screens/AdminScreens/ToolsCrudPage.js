import React from 'react'
import { setToolsList } from '../../redux'
import { ButtonWithIcon, FlexHorizontalLayout, FormFieldWrapper, IdImage, InputText, Label, MarginSpacer, PrimaryFullButton, ScrollViewLayout, StartLayout } from '../../components'
import { axiosExtender } from '../../config/axios_config'
import useToast from '../../hooks/useToast'
import Toast from 'react-native-toast-message'
import { useState } from 'react'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import * as ImagePicker from "expo-image-picker";
import { objectHasBlank, uploadImages } from '../../utils/TOOLS'
import { Alert, View } from 'react-native'

const ToolsCrudPage = (props) => {
    const initialData = props?.route?.params?.item

    const [image, setImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [newData, setNewData] = useState({
        name: "",
        price: "",
        image: "",
        type: "Mechanic"
    })

    const submitHandler = async (image) => {
        let result;
        if (!initialData) {
            result = await axiosExtender("tools/add", "post", { ...newData, image: image })
        }
        else {
            result = await axiosExtender("tools/update/" + newData?._id, "put", { ...newData, image: image })
        }

        if (result?.success) {
            loadHandler()
            useToast({
                type: "success",
                text1: initialData ? "Tools has been updated" : "Tools has been added!",
                onHide: () => props?.navigation?.goBack()
            });

        } else {
            setIsLoading(false);
            useToast({ type: "error", text1: "Something went wrong!" });
            console.log("Error:" + e.message);
        }
    }

    const loadHandler = async () => {
        const result = await axiosExtender("tools", "get")
        if (result?.success) {
            props?.setToolsList(result.data)
        }
    }
    const verifyHandler = async () => {
        const { name, price } = newData
        if (objectHasBlank({ name, price }) || (!initialData && image == null))
            return useToast({ type: "error", text1: "Please fill up the fields correctly!!" })
        setIsLoading(true)
        await uploadImages([image])
            .then(async (imageUrls) => {
                await submitHandler(imageUrls[0])
            })
            .catch((error) => {
                useToast({ type: "error", text1: "Something went wrong!" });
                setIsLoading(false)
            });
    }
    useEffect(() => {
        if (initialData) {
            const { name, price, image, _id, type } = initialData
            setNewData({ name, price, image, _id, type })
        }
    }, [])
    const deleteHandler = () => {
        Alert.alert('Delete', 'Are you sure you want to delete this?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    setIsLoading(true)
                    const res = await axiosExtender("tools/delete/", "delete", initialData?._id)
                    await loadHandler()
                    useToast({
                        type: "success",
                        text1: "Tool has been deleted",
                        onHide: props?.navigation?.goBack()
                    });
                }
            },
        ]);
    }
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
    return (
        <ScrollViewLayout>

            <FormFieldWrapper>
                <Label>Name:</Label>
                <InputText placeholder=" Name" editable={!isLoading} onChangeText={(e) => setNewData({ ...newData, name: e })}
                    value={newData.name}
                />
            </FormFieldWrapper>
            <FormFieldWrapper>
                <Label>Price:</Label>
                <InputText
                    keyboardType="number-pad"
                    placeholder="Price" editable={!isLoading} onChangeText={(e) => setNewData({ ...newData, price: e })}
                    value={newData.price}
                />
            </FormFieldWrapper>
            <FormFieldWrapper >
                <Label>Image:</Label>
                <IdImage uri={image?.uri || newData?.image} />
                {!isLoading && (
                    <>
                        <MarginSpacer space={2} />
                        <PrimaryFullButton custom="bg-slate-100 text-black"
                            onPress={() => imagePickerHandler(setImage)}
                        >
                            Choose Image
                        </PrimaryFullButton>
                    </>
                )}
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            <FormFieldWrapper>
                <PrimaryFullButton onPress={() => !isLoading && verifyHandler()}>{isLoading ? "Submitting..." : "Submit"}</PrimaryFullButton>
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            {(!isLoading && initialData) &&
                <FormFieldWrapper>
                    <PrimaryFullButton custom="bg-rose-500" onPress={() => !isLoading && deleteHandler()}>Delete</PrimaryFullButton>
                </FormFieldWrapper>
            }
            <MarginSpacer space={2} />
            <Toast />
        </ScrollViewLayout>
    )
}

export default connect(null, { setToolsList })(ToolsCrudPage)
