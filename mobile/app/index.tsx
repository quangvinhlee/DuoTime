import { View, Text, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useState } from "react";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  };

  const testBackendConnection = async () => {
    try {
      setIsLoading(true);

      // Test the backend connection with a mock ID token
      const mockIdToken = "mock_id_token_for_testing";

      const response = await fetch("http://192.168.4.86:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation GoogleLogin($googleLoginInput: GoogleLoginInput!) {
              googleLogin(googleLoginInput: $googleLoginInput) {
              token
              }
            }
          `,
          variables: {
            googleLoginInput: {
              idToken: mockIdToken,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.data?.googleLogin) {
        Alert.alert(
          "Success!",
          `Backend connection working!\nToken: ${result.data.googleLogin.token.substring(0, 20)}...`
        );
      } else {
        Alert.alert(
          "Error",
          result.errors?.[0]?.message || "Backend test failed"
        );
      }
    } catch (error) {
      console.error("Backend test error:", error);
      Alert.alert(
        "Error",
        "Cannot connect to backend. Make sure it's running on 192.168.4.86:3000"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Configure Google Sign-In
      configureGoogleSignIn();

      // Sign in with Google
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Get the ID token
      const tokens = await GoogleSignin.getTokens();
      console.log("Google Sign-In tokens:", tokens);

      if (tokens.idToken) {
        // Send the real ID token to your backend
        const response = await fetch("http://192.168.4.86:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation GoogleLogin($googleLoginInput: GoogleLoginInput!) {
                googleLogin(googleLoginInput: $googleLoginInput) {
                token
                }
              }
            `,
            variables: {
              googleLoginInput: {
                idToken: tokens.idToken,
              },
            },
          }),
        });

        const result = await response.json();

        console.log("Google login result:", JSON.stringify(result, null, 2));

        if (result.data?.googleLogin) {
          Alert.alert(
            "Success!",
            `Welcome ${result.data.googleLogin.token.substring(0, 20)}...`
          );
        } else {
          Alert.alert(
            "Backend Error",
            result.errors?.[0]?.message || "Backend authentication failed"
          );
        }
      } else {
        Alert.alert("Error", "Failed to get ID token from Google");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      Alert.alert("Error", "Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-gray-500 text-lg mb-8">Welcome to DuoTime</Text>

      <TouchableOpacity
        onPress={testBackendConnection}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg mb-4 ${
          isLoading ? "bg-gray-400" : "bg-green-500"
        }`}
      >
        <Text className="text-white font-semibold text-center">
          {isLoading ? "Testing..." : "Test Backend Connection (Mock)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signInWithGoogle}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg ${
          isLoading ? "bg-gray-400" : "bg-blue-500"
        }`}
      >
        <Text className="text-white font-semibold text-center">
          {isLoading ? "Signing in..." : "Real Google Sign-In"}
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-400 text-sm mt-4 text-center">
        Make sure your backend is running on 192.168.4.86:3000
      </Text>
    </View>
  );
}
