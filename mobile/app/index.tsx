import { Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

export default function Index() {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // For web and to get idToken
      offlineAccess: true,
    });
  }, []);

  const signIn = async () => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log(response);

      if (isSuccessResponse(response)) {
        // Navigate to user info page with user data
        router.push({
          pathname: "/userinfo",
          params: { userInfo: JSON.stringify(response.data) },
        });
      } else {
        Alert.alert("Sign-in cancelled", "Sign-in was cancelled by user");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Error", "Sign-in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Error", "Play services not available or outdated");
            break;
          default:
            Alert.alert("Error", "Something went wrong with sign-in");
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setIsSigninInProgress(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 30, textAlign: "center" }}>
        Welcome to DuoTime
      </Text>

      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        disabled={isSigninInProgress}
      />
    </View>
  );
}
