import React from 'react'
import { setNewsModifyDone, setNewsList } from '../../redux'
import { ButtonWithIcon, FormFieldWrapper, Label, MarginSpacer, PrimaryFullButton, StartLayout } from '../../components'
import { axiosExtender } from '../../config/axios_config'
import { useState } from 'react'
import { ICONS } from '../../utils'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { useEffect } from 'react'
import { firebase } from "../../config/firebase_config";
import useToast from "../../hooks/useToast";

import * as ImagePicker from "expo-image-picker";
import { ref, getStorage, getDownloadURL } from "firebase/storage";
import Toast from 'react-native-toast-message'
import { Image } from 'react-native'
import { deleteFromFirebase, uploadImages } from '../../utils/TOOLS'

const NewsCrudPage = (props) => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const imagePickerHandler = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowEditing: true,
                // aspect: [16, 9],
                quality: 1,
            });
            if (!result.canceled) {
                const source = { uri: result.assets[0].uri };
                setImage(source);
            }
        } catch (e) { }
    };

    const submitHandler = () => {
        setIsLoading(true);
        uploadImages([image])
            .then((imageUrls) => {
                addHandler({ news: imageUrls[0] });
            })
            .catch((error) => {
                useToast({ type: "error", text1: "Something went wrong!" });
                setIsLoading(false)
            });
    };

    const addHandler = async (newData) => {
        let result;
        if (!props?.selected_news) {
            result = await axiosExtender("news/add", "post", { image: newData?.news })
        }
        else {
            result = await axiosExtender("news/update/" + props?.selected_news?._id, "put", { image: newData?.news })
        }

        if (result) {
            useToast({
                type: "success",
                text1: !props?.selected_news ? "Image has been added!" : "Image has been updated!",
            });
            setIsLoading(false);
            if (!props?.selected_news) {
                setImage(null)
            }
            await loadHandler()

        } else {
            useToast({ type: "error", text1: "Something went wrong!" });
            console.log("Error:" + e.message);

        }
        setIsLoading(false);
    };

    const loadHandler = async () => {
        const result = await axiosExtender("news", "get")
        if (result?.success) {
            props?.setNewsList([...result.data])
            props?.setNewsModifyDone(!props.modify_done)
        }
    }

    const deleteHandler = () => {
        Alert.alert('Delete', 'Are you sure you want to delete this?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    const result = await axiosExtender("news/delete/", "delete", props?.selected_news._id)
                    deleteFromFirebase(props?.selected_news?.image)
                    await loadHandler()
                    props?.navigation?.navigate("admin-news")
                }
            },
        ]);
    }

    useEffect(() => {

    }, [props?.selected_news])


    return (
        <StartLayout>
            <FormFieldWrapper>
                <Label>Image Preview:</Label>
                <Image
                    style={[
                        {
                            width: "100%",
                            aspectRatio: 16 / 9,
                        },
                    ]}
                    className="rounded-md w-full aspect-video bg-slate-200"
                    source={{
                        uri: image?.uri || props?.selected_news?.image,
                    }}
                />
                {!isLoading && (
                    <>
                        <MarginSpacer space={2} />
                        <PrimaryFullButton custom="bg-slate-300 text-black"
                            onPress={imagePickerHandler}
                        >
                            Choose Image
                        </PrimaryFullButton>
                    </>
                )}
                {!props?.selected_news && image?.uri &&
                    <>
                        <MarginSpacer space={2} />
                        <PrimaryFullButton onPress={submitHandler} activeOpacity={isLoading}>{isLoading ? "Submitting..." : "Submit"}</PrimaryFullButton>
                    </>
                }
                {props?.selected_news &&
                    <>
                        {image?.uri &&
                            <>
                                <MarginSpacer space={2} />
                                <ButtonWithIcon
                                    icon={ICONS.SAVE}
                                    activeOpacity={isLoading && 1}
                                    wrapperCustom="bg-zinc-900 p-4"
                                    onPress={() => !isLoading && submitHandler()}
                                    contentCustom="text-white text-lg"
                                    text={isLoading ? "Saving..." : "Save Changes"} />
                            </>
                        }
                        {!isLoading &&
                            <>
                                <MarginSpacer space={2} />
                                <ButtonWithIcon
                                    icon={ICONS.TRASHBIN}
                                    activeOpacity={isLoading && 1}
                                    wrapperCustom="bg-rose-500 p-4"
                                    onPress={() => !isLoading && deleteHandler()}
                                    contentCustom="text-white text-lg"
                                    text="Delete" />
                            </>
                        }

                    </>
                }
            </FormFieldWrapper>
            <MarginSpacer space={2} />
        </StartLayout>
    )
}

const mapStateToProps = (state) => {
    return {
        modify_done: state.news.modify_done,
        selected_news: state?.news?.selected_news
    }
}
export default connect(mapStateToProps, { setNewsList, setNewsModifyDone })(NewsCrudPage)
