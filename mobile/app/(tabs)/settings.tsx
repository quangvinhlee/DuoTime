import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../store/auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsPage() {
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    Alert.alert(
      "💔 Sign Out",
      "Are you sure you want to sign out of your love account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/auth");
            } catch (error) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF5F5" }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="pt-12 pb-4">
            <Text className="text-2xl font-bold text-gray-900">
              Love Settings
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Customize your love experience
            </Text>
          </View>

          {/* Profile Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              My Profile
            </Text>

            <View className="bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl p-6 border border-pink-200">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  }}
                  className="w-20 h-20 rounded-full mr-4 border-4 border-red-400"
                />
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-900">
                    John Doe
                  </Text>
                  <Text className="text-sm text-gray-600">
                    john.doe@example.com
                  </Text>
                  <Text className="text-sm text-red-500 font-semibold">
                    💕 In Love with Sarah
                  </Text>
                </View>
                <TouchableOpacity className="border border-red-500 px-4 py-2 rounded-full">
                  <Text className="text-red-500 font-semibold text-sm">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Love Preferences */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Preferences
            </Text>

            <View className="space-y-3">
              <View className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center mr-4">
                      <Text className="text-xl">💕</Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-900">
                        Love Notifications
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Get notified about love reminders
                      </Text>
                    </View>
                  </View>
                  <Switch value={true} />
                </View>
              </View>

              <View className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                      <Text className="text-xl">🎁</Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-900">
                        Surprise Mode
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Keep surprises hidden until time
                      </Text>
                    </View>
                  </View>
                  <Switch value={true} />
                </View>
              </View>

              <View className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                      <Text className="text-xl">💌</Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-900">
                        Love Messages
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Receive sweet messages from partner
                      </Text>
                    </View>
                  </View>
                  <Switch value={true} />
                </View>
              </View>

              <View className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                      <Text className="text-xl">🌙</Text>
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-900">
                        Dark Love Mode
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Switch to romantic dark theme
                      </Text>
                    </View>
                  </View>
                  <Switch value={false} />
                </View>
              </View>
            </View>
          </View>

          {/* Love Account */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Account
            </Text>

            <View className="space-y-3">
              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">💑</Text>
                  </View>
                  <Text className="text-gray-900 font-medium">
                    Couple Profile
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">🔒</Text>
                  </View>
                  <Text className="text-gray-900 font-medium">
                    Love Privacy
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">💎</Text>
                  </View>
                  <Text className="text-gray-900 font-medium">
                    Love Premium
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Love Support */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Support
            </Text>

            <View className="space-y-3">
              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">💝</Text>
                  </View>
                  <Text className="text-gray-900 font-medium">
                    Love Help Center
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">📜</Text>
                  </View>
                  <Text className="text-gray-900 font-medium">Love Terms</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">🛡️</Text>
                  </View>
                  <Text className="text-gray-900 font-medium">
                    Love Privacy Policy
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Love Stats */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Statistics
            </Text>

            <View className="bg-white rounded-2xl p-6 border border-pink-200 shadow-sm">
              <View className="space-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700">Days in Love</Text>
                  <Text className="font-bold text-red-500">365</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700">Love Reminders Sent</Text>
                  <Text className="font-bold text-pink-500">127</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700">Surprises Created</Text>
                  <Text className="font-bold text-purple-500">23</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700">Love Streak</Text>
                  <Text className="font-bold text-green-500">7 days</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Love Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Actions
            </Text>

            <View className="space-y-3">
              <TouchableOpacity className="bg-red-500 py-4 px-6 rounded-2xl">
                <Text className="text-white font-bold text-center text-lg">
                  💝 Send Love to Sarah
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-red-500 py-4 px-6 rounded-2xl">
                <Text className="text-red-500 font-bold text-center text-lg">
                  💌 Write Love Note
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out */}
          <View className="mb-6">
            <TouchableOpacity
              className="bg-gray-500 py-4 px-6 rounded-2xl"
              onPress={handleSignOut}
            >
              <Text className="text-white font-bold text-center text-lg">
                💔 Sign Out
              </Text>
            </TouchableOpacity>
          </View>

          {/* Love Quote */}
          <View className="bg-gradient-to-r from-pink-300 to-red-300 rounded-2xl p-6 border border-red-200 mb-6">
            <View className="items-center">
              <Text className="text-3xl mb-4">💕</Text>
              <Text className="text-base text-gray-800 text-center italic leading-6 mb-4">
                &apos;The best thing to hold onto in life is each other.&apos;
              </Text>
              <View className="bg-red-200 rounded-xl px-4 py-2">
                <Text className="text-xs font-bold text-red-600">
                  💕 Love Quote
                </Text>
              </View>
            </View>
          </View>

          {/* App Version */}
          <View className="items-center mb-6">
            <Text className="text-sm text-gray-400">DuoTime v1.0.0</Text>
            <Text className="text-xs text-gray-400 mt-1">
              Made with 💕 for couples
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
