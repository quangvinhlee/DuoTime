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
import CustomAlert from "@/components/CustomAlert";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
  });
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

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const signInWithGoogle = async () => {
    if (loading) return; // Prevent multiple simultaneous sign-ins

    setLoading(true);
    try {
      // Step 1: Check Play Services
      await GoogleSignin.hasPlayServices();

      // Step 2: Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      const idToken =
        (userInfo as any).idToken || (userInfo as any).data?.idToken;

      if (!idToken) {
        throw new Error("Failed to get ID token from Google");
      }

      // Step 3: Login with backend
      const { data, errors } = await googleLogin({
        variables: { googleLoginInput: { idToken } },
      });

      if (errors || !data?.googleLogin.token) {
        const errorMessage = errors?.[0]?.message || "Login failed";
        console.error("GraphQL errors:", errors);
        throw new Error(errorMessage);
      }

      const token = data.googleLogin.token;

      // Step 4: Store token
      await SecureStore.setItemAsync("jwt_token", token);

      // Step 5: Get user profile
      try {
        const { data: profileData, errors: profileErrors } = await getProfile();

        if (profileErrors) {
          console.error("Profile fetch errors:", profileErrors);
          throw new Error("Failed to fetch user profile");
        }

        if (profileData?.getProfile) {
          await setAuth(token, profileData.getProfile);
        } else {
          throw new Error("No profile data received");
        }
      } catch (profileError) {
        console.error("Profile fetch error:", profileError);
        // Even if profile fetch fails, we can still proceed with the token
        // The user can retry profile fetch later
        showAlert(
          "Almost there! 💕",
          "We connected successfully, but couldn't get your profile details just yet. Don't worry, you can try again later!",
          "warning"
        );
        return;
      }

      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Sign in error:", error);

      // Handle specific Google Sign-In errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        showAlert(
          "Oh no! 💔",
          "You cancelled our love connection. Don't worry, we'll be here when you're ready to try again!",
          "info"
        );
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showAlert(
          "Hold on, love! 💕",
          "We're already working on connecting you. Please wait a moment for the magic to happen!",
          "info"
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showAlert(
          "Missing something special! 💝",
          "Google Play Services is needed to bring us together. Please make sure it's available on your device.",
          "error"
        );
      } else {
        // Handle other errors
        const errorMessage =
          error.message ||
          "Oops! Something went wrong while trying to connect our hearts. Let's try again!";
        showAlert("Connection failed 💔", errorMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    // No need for navigation logic here since we navigate directly on success
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF5F5" }}>
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
          <View className="w-32 h-32 mb-6 bg-white rounded-2xl items-center justify-center shadow-lg">
            <Image
              source={require("../assets/images/logo.png")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
          <Text
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "#2D3748" }}
          >
            Welcome to <Text style={{ color: "#2D3748" }}>Duo</Text>
            <Text style={{ color: "#FF6B6B" }}>Time</Text>
          </Text>
          <Text className="text-lg text-center" style={{ color: "#718096" }}>
            Where love meets time ✨
          </Text>
        </View>

        {/* Features */}
        <View className="mb-12">
          <View
            className="bg-white rounded-2xl shadow-md border-2 p-6"
            style={{ borderColor: "#FFB3B3" }}
          >
            <Text
              className="text-xl font-semibold text-center mb-8"
              style={{ color: "#2D3748" }}
            >
              Create magical moments together
            </Text>

            <View className="space-y-4">
              <View
                className="flex-row items-center rounded-xl p-4"
                style={{ backgroundColor: "#FFF5F5" }}
              >
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                  style={{ backgroundColor: "#FF6B6B" }}
                >
                  <Ionicons name="heart" size={18} color="white" />
                </View>
                <View className="flex-1 ">
                  <Text
                    className="font-semibold text-lg"
                    style={{ color: "#2D3748" }}
                  >
                    Love Reminders
                  </Text>
                  <Text className="text-sm" style={{ color: "#718096" }}>
                    Never miss a moment to show you care
                  </Text>
                </View>
              </View>
              <View
                className="h-px mx-2"
                style={{ backgroundColor: "#FFB3B3" }}
              />
              <View
                className="flex-row items-center rounded-xl p-4"
                style={{ backgroundColor: "#FFF5F5" }}
              >
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                  style={{ backgroundColor: "#FF8E8E" }}
                >
                  <Ionicons name="gift" size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-semibold text-lg"
                    style={{ color: "#2D3748" }}
                  >
                    Surprise Moments
                  </Text>
                  <Text className="text-sm" style={{ color: "#718096" }}>
                    Create unexpected joy for your love
                  </Text>
                </View>
              </View>
              <View
                className="h-px mx-2"
                style={{ backgroundColor: "#FFB3B3" }}
              />
              <View
                className="flex-row items-center rounded-xl p-4"
                style={{ backgroundColor: "#FFF5F5" }}
              >
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                  style={{ backgroundColor: "#FF6B6B" }}
                >
                  <Ionicons name="chatbubbles" size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-semibold text-lg"
                    style={{ color: "#2D3748" }}
                  >
                    Love Messages
                  </Text>
                  <Text className="text-sm" style={{ color: "#718096" }}>
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
            className={`w-full rounded-xl shadow-lg active:scale-98 ${
              loading ? "opacity-70" : ""
            }`}
            style={{
              backgroundColor: "#FF6B6B",
              shadowColor: "#FF6B6B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
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

          {loading && (
            <View className="mt-4 flex-row items-center">
              <ActivityIndicator color="#FF6B6B" size="small" />
              <Text className="font-medium ml-2" style={{ color: "#718096" }}>
                Signing in...
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="items-center mb-8">
          <View
            className="w-full bg-white rounded-2xl shadow-md border-2 p-6"
            style={{ borderColor: "#FFB3B3" }}
          >
            <View className="items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: "#FFF5F5" }}
              >
                <Ionicons name="heart" size={24} color="#FF6B6B" />
              </View>
              <Text
                className="text-center font-medium mt-3 mb-3 italic"
                style={{ color: "#2D3748" }}
              >
                &ldquo;Love is the greatest refreshment in life.&rdquo;
              </Text>
              <Text className="text-sm" style={{ color: "#718096" }}>
                Pablo Picasso
              </Text>
            </View>
          </View>
          <Text
            className="text-xs text-center mt-4"
            style={{ color: "#A0AEC0" }}
          >
            By continuing, you agree to our{" "}
            <Text style={{ color: "#FF6B6B", fontWeight: "600" }}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ color: "#FF6B6B", fontWeight: "600" }}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleAlertClose}
      />
    </SafeAreaView>
  );
}
