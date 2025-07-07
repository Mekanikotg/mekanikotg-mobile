// REDUX
import { Provider } from "react-redux";
import store from "./redux/store";

import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AdminHomeScreen,
  MechanicCrudPage,
  ApplyMenuPage,
  ChangeProfileScreen,
  UserMechanicHomeScreen,
  FaqsMenuPage,
  ForgotPassword,
  HistoryMenuPage,
  LoginScreen,
  ManageMechanicPage,
  ManageNewsPage,
  ManageToolPage,
  ManageTowingPage,
  ManageUserPage,
  ManageVerificationPage,
  CustomerBookingPage,
  ProfileInformationPage,
  ProfileMenuPage,
  ProfilePasswordPage,
  ProfileVerificationPage,
  RegisterScreen,
  ToolsCrudPage,
  TowingCrudPage,
  TowingServicesPage,
  UserCrudPage,
  VerificationCrudPage,
  EulaScreen,
} from "./screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewsCrudPage from "./screens/AdminScreens/NewsCrudPage";
import ChangePassword from "./screens/ChangePassword";
import TermsScreen from "./screens/TermsScreen";


export default function App() {
  // login default
  const [initialPage, setInitialPage] = useState("login");
  // check if login or not
  const checkSession = async () => {
    try {
      const user_session = await AsyncStorage.getItem("user");
      if (user_session) {
        const user_data = JSON.parse(user_session)
        let user_role = user_data?.role;
        switch (Number(user_role)) {
          case 0:
          case 1:
            setInitialPage("customer-home")
            break;
          case 2:
            setInitialPage("admin-home")
            break;
          default:
            break;
        }
      } else {
        setInitialPage("login");
      }
    } catch (e) {
      console.log("Warning Occur in Home.js: " + e.message);
    }
  };
  // mounting phase one time
  useEffect(() => {
    const load = async () => {
      checkSession();
    };
    load();
  }, []);
  // load fonts
  const [loaded] = useFonts({
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    semibold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  // navigation
  const Stack = createNativeStackNavigator();
  const custom_options = (title) => {
    return {
      headerTitle: title,
      headerTitleStyle: {
        fontFamily: "regular",
        fontSize: 17,
      },
      headerShadowVisible: false,
    };
  };
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialPage}>
          {/* login */}
          <Stack.Screen
            title="Login"
            name="login"
            component={LoginScreen}
            options={(props) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            title="Forgot Password"
            name="forgot-password"
            component={ForgotPassword}
            options={(props) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            title="Change Password"
            name="change-password"
            component={ChangePassword}
            options={(props) => ({
              headerShown: false,
            })}
          />
          {/* register */}
          <Stack.Screen
            title="Register"
            name="register"
            component={RegisterScreen}
            options={(props) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            title=""
            name="eula"
            component={EulaScreen}
            options={(props) => ({
              headerShown: true,
              headerTitle: "",
              headerShadowVisible: false

            })}
          />
          <Stack.Screen
            title="Terms and Conditions"
            name="terms"
            component={TermsScreen}
            options={(props) => ({
              headerTitle: "",
              headerShadowVisible: false
            })}
          />
          {/* customer home  */}
          <Stack.Screen
            title=""
            name="customer-home"
            component={UserMechanicHomeScreen}
            options={(props) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            title=""
            name="customer-towing"
            component={TowingServicesPage}
            options={(props) => custom_options("Towing")}
          />
          {/* end of services  */}

          <Stack.Screen
            title=""
            name="customer-profile-information"
            component={ProfileInformationPage}
            options={(props) => custom_options("Information")}
          />
          <Stack.Screen
            title=""
            name="customer-profile-password"
            component={ProfilePasswordPage}
            options={(props) => custom_options("Change Password")}
          />
          <Stack.Screen
            title=""
            name="customer-profile-verification"
            component={ProfileVerificationPage}
            options={(props) => custom_options("Verification")}
          />
          <Stack.Screen
            title=""
            name="customer-profile"
            component={ProfileMenuPage}
            options={(props) => custom_options("Profile")}
          />

          <Stack.Screen
            title=""
            name="customer-history"
            component={HistoryMenuPage}
            options={(props) => custom_options("History")}
          />

          <Stack.Screen
            title=""
            name="customer-faqs"
            component={FaqsMenuPage}
            options={(props) => custom_options("Faqs")}
          />
          {/* admin  */}
          <Stack.Screen
            title=""
            name="admin-home"
            component={AdminHomeScreen}
            options={(props) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            title=""
            name="admin-verification"
            component={ManageVerificationPage}
            options={(props) => custom_options("Verification")}
          />
          <Stack.Screen
            title=""
            name="admin-tools"
            component={ManageToolPage}
            options={(props) => custom_options("Tools Management")}
          />
          <Stack.Screen
            title=""
            name="admin-users"
            component={ManageUserPage}
            options={(props) => custom_options("User Management")}
          />
          <Stack.Screen
            title=""
            name="admin-mechanics"
            component={ManageMechanicPage}
            options={(props) => custom_options("Mechanic Management")}
          />
          <Stack.Screen
            title=""
            name="admin-towing"
            component={ManageTowingPage}
            options={(props) => custom_options("Towing Management")}
          />
          <Stack.Screen
            title=""
            name="admin-news"
            component={ManageNewsPage}
            options={(props) => custom_options("News Management")}
          />
          <Stack.Screen
            title=""
            name="customer-apply"
            component={ApplyMenuPage}
            options={(props) => custom_options("Start Job")}
          />
          {/* end of admin tabs  */}
          <Stack.Screen
            title=""
            name="admin-towing-crud"
            component={TowingCrudPage}
            options={(props) => custom_options("Towing Company Information")}
          />
          <Stack.Screen
            title=""
            name="admin-mechanic-crud"
            component={MechanicCrudPage}
            options={(props) => custom_options("Mechanic Information")}
          />
          <Stack.Screen
            title=""
            name="admin-news-crud"
            component={NewsCrudPage}
            options={(props) => custom_options("News Information")}
          />
          <Stack.Screen
            title=""
            name="admin-user-crud"
            component={UserCrudPage}
            options={(props) => custom_options("User Information")}
          />
          <Stack.Screen
            title=""
            name="admin-tools-crud"
            component={ToolsCrudPage}
            options={(props) => custom_options("Tools Information")}
          />
          <Stack.Screen
            title=""
            name="admin-verification-crud"
            component={VerificationCrudPage}
            options={(props) => custom_options("User Sent Information")}
          />
          {/* end of admin children tabs  */}
          <Stack.Screen
            title=""
            name="change-profile"
            component={ChangeProfileScreen}
            options={(props) => custom_options("Change Profile Picture")}
          />
          {/* booking  */}
          <Stack.Screen
            title=""
            name="mechanic-booking"
            component={CustomerBookingPage}
            options={(props) => custom_options("Book Mechanic")}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

