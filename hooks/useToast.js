import Toast from "react-native-toast-message";

export default useToast = ({ text1, text2, onShow, type, onHide, position = "bottom" }) => {
  Toast.show({
    type,
    position,
    text1,
    text2,
    visibilityTime: 3000,
    autoHide: true,
    onShow,
    onHide,
  });
};