import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { firebase } from "../config/firebase_config";
import { Alert } from "react-native";

export const objectHasBlank = (obj) => {
    const newObj = Object.values(obj)
    return newObj.filter(arr => arr == undefined || arr?.trim().length == 0).length > 0
}

export const uploadImages = async (images, handler, oldImage) => {
    const imageUrls = [];

    try {
        for (const image of images) {
            const response = await fetch(image?.uri);
            const blob = await response.blob();
            const filename = image?.uri.substring(image?.uri.lastIndexOf("/") + 1);
            var refr = firebase.storage().ref().child(filename).put(blob);
            await refr;
            const storage = getStorage();
            const reference = ref(storage, filename);
            const imageUrl = await getDownloadURL(reference);
            imageUrls.push(imageUrl);
        }

        if (oldImage) {
            deleteFromFirebase(oldImage);
        }
    } catch (e) {
        console.log(e);
    }
    return imageUrls;
};

export const deleteFromFirebase = (url) => {
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

export const badgeStatus = (status) => {
    switch (status) {
        case 0:
            return "Unverified"
        case 1:
            return "Verified"
        case 2:
            return "Verfification is on process"
        case 4:
            return "Verification rejected"
        default:
            return "Unverified"

    }
}
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export const validatePhone = (phone) => {

    return phone.length == 11 && phone.substring(0, 2) == "09" && Number(phone);
}

export const alertHandler = ({ title, message, handler }) => {
    try {
        Alert.alert(title, message, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    handler()
                }
            },
        ]);
    } catch (e) {
        console.log(e)
    }
}