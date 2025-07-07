import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiSPhnxzHeVMvGOotDZ1n1DfNHYCSt6fc",
  authDomain: "mekanikotg.firebaseapp.com",
  projectId: "mekanikotg",
  storageBucket: "mekanikotg.appspot.com",
  messagingSenderId: "107727351240",
  appId: "1:107727351240:web:83c55feeeb8b2c59fde4fd"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export { firebase };
