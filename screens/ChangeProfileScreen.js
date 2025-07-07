import { firebase } from "../config/firebase_config";
import useToast from "../hooks/useToast";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from "react-native";
import React from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { connect } from "react-redux";
import { useState } from "react";
import { setUserCredentials } from "../redux";

import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { axiosExtender } from "../config/axios_config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormFieldWrapper, MarginSpacer, PrimaryFullButton, ScrollViewLayout } from "../components";

const ChangeProfileScreen = (props) => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = () => {
        setIsLoading(true);
        uploadImage();
    };

    const deleteFromFirebase = (url) => {
        try {
            let pictureRef = firebase.storage().refFromURL(url);
            pictureRef
                .delete()
                .then(() => {
                    ("Image deleted");
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (e) {
            console.log("DELETING IMAGE FROM FIREBASE", e);
        }
    };
    const storeHandler = async (item) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify(item));
        } catch (e) {
            console.log("Warning set in ChangeProfileScreen.js: " + e);
        }
    };
    const updateHandler = async (newData) => {
        const result = await axiosExtender("user/update/" + props?.credentials._id, "put",
            { profile_picture: newData?.profile_picture }
        )
        if (result) {
            storeHandler({ ...props?.credentials, ...newData });
            props.setUserCredentials({ ...props.credentials, ...newData });

            useToast({
                type: "success",
                text1: "Profile Picture Changed Successfuly!",
            });
            setIsLoading(false);
        } else {
            useToast({ type: "error", text1: "Something went wrong!" });
            console.log("Error:" + result);

        }
        setIsLoading(false);
    };
    const uploadImage = async () => {
        try {
            const response = await fetch(image?.uri);
            const blob = await response.blob();
            const filename = image?.uri.substring(image?.uri.lastIndexOf("/") + 1);
            var refr = firebase.storage().ref().child(filename).put(blob);
            try {
                await refr;
                const storage = getStorage();
                const reference = ref(storage, filename);
                await getDownloadURL(reference)
                    .then((x) => {
                        if (props?.credentials?.profile_picture) {
                            deleteFromFirebase(props?.credentials?.profile_picture)
                        }
                        updateHandler({ profile_picture: x });
                    })
                    .catch(() => {
                    });
            } catch (e) {
                console.log(e);
                setIsLoading(false);
                useToast({ type: "error", text1: "Something went wrong!" });
            }
        } catch (e) {
            useToast({ type: "error", text1: "Something went wrong!" });
            console.log(e);
            setIsLoading(false);
        }
    };

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
    return (
        <ScrollViewLayout>
            <FormFieldWrapper>
                <Image
                    style={[
                        {
                            objectFit: "cover",
                            width: "100%",
                            aspectRatio: 1 / 1,
                            borderRadius: 500,
                            borderWidth: 1,
                            borderColor: "#d4d4d4"
                        },
                    ]}
                    source={{
                        uri: image?.uri || props.credentials?.profile_picture,
                    }}
                />
                <MarginSpacer space={2} />
                {!isLoading && (
                    <PrimaryFullButton custom="bg-slate-300 text-black"
                        onPress={imagePickerHandler}
                    >
                        Choose Image
                    </PrimaryFullButton>
                )}
                {image?.uri &&
                    <>
                        <MarginSpacer space={2} />
                        <PrimaryFullButton onPress={submitHandler} activeOpacity={isLoading}>{isLoading ? "Submitting..." : "Submit"}</PrimaryFullButton>
                    </>
                }
            </FormFieldWrapper>
        </ScrollViewLayout>
    );
};

const mapStateToProps = (state) => {
    return {
        credentials: state.user.credentials,
    };
};

export default connect(mapStateToProps, {
    setUserCredentials,
})(ChangeProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "white",
    },
    submit_button: {
        padding: 10,
        fontFamily: "semibold",
        borderRadius: 10,
        marginTop: 5,
        textAlign: "center",
    },
    fields: {
        padding: 10,
        fontFamily: "semibold",
        borderRadius: 10,
        marginVertical: 5,
        borderWidth: 1,
    },
});