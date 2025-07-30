import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import {
  useGoogleLoginMutation,
  useGetProfileLazyQuery,
} from "@/generated/graphql";
import { useAuthStore } from "@/store/auth";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [googleLogin] = useGoogleLoginMutation();
  const [getProfile] = useGetProfileLazyQuery();
  const setAuth = useAuthStore((state) => state.setAuth);
  const insets = useSafeAreaInsets();

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

      // 2. Save token to SecureStore first so Apollo can use it
      await SecureStore.setItemAsync("jwt_token", token);

      // 3. Now fetch user profile (Apollo will include the token automatically)
      const { data: profileData } = await getProfile();

      // 4. Store user in Zustand (token already in SecureStore)
      if (profileData?.getProfile) {
        await setAuth(token, profileData.getProfile);
      }

      // Success
      Toast.show({
        type: "success",
        text1: "Welcome to DuoTime!",
        text2: "You're now signed in.",
      });
      router.replace("/(tabs)/home");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          type: "info",
          text1: "Sign In Cancelled",
          text2: "You cancelled the sign-in process.",
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: "info",
          text1: "Sign In In Progress",
          text2: "Sign-in is already in progress.",
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: "error",
          text1: "Play Services Not Available",
          text2: "Google Play Services is not available on this device.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Sign in failed",
          text2: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 32,
          paddingTop: 10,
          paddingBottom: insets.bottom - 50,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-32 h-32 mb-6 bg-gray-100 rounded-2xl items-center justify-center">
            <Image
              source={require("../assets/images/logo.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-bold text-center mb-2">
            Welcome to <Text className="text-gray-900">Duo</Text>
            <Text style={{ color: "#ee0761" }}>Time</Text>
          </Text>
          <Text className="text-lg text-gray-500 text-center">
            Where love meets time ✨
          </Text>
        </View>

        {/* Features */}
        <View className="mb-12">
          <View className="bg-white rounded-2xl shadow-md border-2 border-pink-200 p-6">
            <Text className="text-xl font-semibold text-gray-800 text-center mb-8">
              Create magical moments together
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4 ">
                <View className="w-10 h-10 bg-pink-500 rounded-lg items-center justify-center mr-4">
                  <Ionicons name="heart" size={18} color="white" />
                </View>
                <View className="flex-1 ">
                  <Text className="font-semibold text-gray-900 ">
                    Love Reminders
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Never miss a moment to show you care
                  </Text>
                </View>
              </View>
              <View className="h-px bg-gray-300 mx-2" />
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4">
                <View className="w-10 h-10 bg-purple-500 rounded-lg items-center justify-center mr-4">
                  <Ionicons name="gift" size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    Surprise Moments
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Create unexpected joy for your love
                  </Text>
                </View>
              </View>
              <View className="h-px bg-gray-300 mx-2" />
              <View className="flex-row items-center bg-gray-50 rounded-xl p-4">
                <View className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center mr-4">
                  <Ionicons name="chatbubbles" size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    Love Messages
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Send romantic notes anytime
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Google Sign-In Button */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={signInWithGoogle}
            disabled={loading}
            className={`w-full bg-black rounded-xl shadow-lg active:scale-98 ${
              loading ? "opacity-70" : ""
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-center py-4 px-6">
              <View className="mr-3 w-6 h-6 bg-white rounded-full items-center justify-center">
                <AntDesign name="google" size={16} color="#4285f4" />
              </View>
              <View className="flex-row items-center justify-center flex-1">
                {loading ? (
                  <>
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold text-lg ml-2">
                      Signing in ...
                    </Text>
                  </>
                ) : (
                  <Text className="text-white font-semibold text-lg">
                    Continue with Google
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mb-8">
          <View className="w-full bg-white rounded-2xl shadow-md border-2 border-pink-200 p-6">
            <View className="items-center">
              <Ionicons name="heart" size={24} color="#ec4899" />
              <Text className="text-gray-700 text-center font-medium mt-3 mb-3">
                &ldquo;Love is the greatest refreshment in life.&rdquo;
              </Text>
              <Text className="text-gray-500 text-sm">Pablo Picasso</Text>
            </View>
          </View>
          <Text className="text-xs text-gray-400 text-center mt-4">
            By continuing, you agree to our{" "}
            <Text className="text-blue-600">Terms of Service</Text> and{" "}
            <Text className="text-blue-600">Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
