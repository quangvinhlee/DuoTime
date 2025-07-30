import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import {
  useGoogleLoginMutation,
  useGetProfileLazyQuery,
} from "@/generated/graphql";
import { useAuthStore } from "@/store/auth";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [googleLogin] = useGoogleLoginMutation();
  const [getProfile] = useGetProfileLazyQuery();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken =
        (userInfo as any).idToken || (userInfo as any).data?.idToken;

      if (!idToken) throw new Error("Failed to get ID token from Google");

      // 1. Call backend to get JWT token
      const { data, errors } = await googleLogin({
        variables: { googleLoginInput: { idToken } },
      });

      if (errors || !data?.googleLogin.token) {
        throw new Error(errors?.[0]?.message || "Login failed");
      }

      const token = data.googleLogin.token;
      console.log("🎯 JWT Token received:", token ? "YES" : "NO");

      // 2. Save token to SecureStore first so Apollo can use it
      console.log("💾 Saving token to SecureStore...");
      await SecureStore.setItemAsync("jwt_token", token);
      console.log("✅ Token saved to SecureStore");

      // 3. Now fetch user profile (Apollo will include the token automatically)
      const { data: profileData } = await getProfile();
      console.log(
        "👤 Profile data received:",
        profileData?.getProfile ? "YES" : "NO"
      );

      // 4. Store user in Zustand (token already in SecureStore)
      if (profileData?.getProfile) {
        console.log("💾 Calling setAuth...");
        await setAuth(token, profileData.getProfile);
        console.log("✅ setAuth completed");
      } else {
        console.log("❌ No profile data, not calling setAuth");
      }

      Alert.alert("Success!", `Welcome to DuoTime! You're now signed in.`);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("❌ Google Sign-In Error:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Sign In Cancelled", "You cancelled the sign-in process.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign In In Progress", "Sign-in is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          "Play Services Not Available",
          "Google Play Services is not available on this device."
        );
      } else {
        Alert.alert("Error", `Failed to sign in: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-pink-50 to-red-50">
      <View className="flex-1 justify-center px-8">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-gradient-to-r from-pink-400 to-red-400 rounded-full items-center justify-center mb-6">
            <Text className="text-4xl">💕</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome to DuoTime
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            Where love meets time
          </Text>
        </View>

        {/* Features */}
        <View className="mb-12">
          <Text className="text-xl font-semibold text-gray-800 text-center mb-6">
            💝 Create magical moments together
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
              <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center mr-4">
                <Text className="text-xl">💕</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  Secret Love Reminders
                </Text>
                <Text className="text-sm text-gray-600">
                  Set sweet reminders for your partner
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-white rounded-2xl p-4 border border-red-200 shadow-sm">
              <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                <Text className="text-xl">🎁</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  Surprise Moments
                </Text>
                <Text className="text-sm text-gray-600">
                  Create unexpected joy for your love
                </Text>
              </View>
            </View>

            <View className="flex-row items-center bg-white rounded-2xl p-4 border border-purple-200 shadow-sm">
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Text className="text-xl">💌</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  Love Messages
                </Text>
                <Text className="text-sm text-gray-600">
                  Send romantic notes anytime
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Google Sign-In Button */}
        <View className="items-center">
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInWithGoogle}
            disabled={loading}
          />

          {loading && (
            <View className="mt-4 flex-row items-center">
              <ActivityIndicator color="#ec4899" size="small" />
              <Text className="text-gray-600 font-medium ml-2">
                💕 Signing in with Google...
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-sm text-gray-500 text-center">
            By continuing, you agree to our{" "}
            <Text className="text-red-500 font-semibold">Love Terms</Text> and{" "}
            <Text className="text-red-500 font-semibold">Privacy Policy</Text>
          </Text>
        </View>

        {/* Love Quote */}
        <View className="mt-12 bg-gradient-to-r from-pink-300 to-red-300 rounded-2xl p-6 border border-red-200">
          <View className="items-center">
            <Text className="text-3xl mb-4">💖</Text>
            <Text className="text-base text-gray-800 text-center italic leading-6 mb-4">
              &apos;Love is the greatest refreshment in life.&apos;
            </Text>
            <View className="bg-red-200 rounded-xl px-4 py-2">
              <Text className="text-xs font-bold text-red-600">
                💕 Love Quote
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
