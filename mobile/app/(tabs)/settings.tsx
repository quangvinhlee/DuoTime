import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../store/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetProfileWithPartnerQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from "@/generated/graphql";
import {
  pickImage,
  takePhoto,
  convertToGraphQLUpload,
} from "@/graphql/utils/fileUpload";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);

  // GraphQL hooks
  const { data: profileData, refetch } = useGetProfileWithPartnerQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  // Use profile data if available, otherwise fall back to auth store user
  const currentUser = profileData?.getProfile || user;

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

  const handleEditProfile = () => {
    setEditName(currentUser?.name || "");
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setIsEditing(true);
    try {
      await updateProfile({
        variables: {
          input: {
            name: editName.trim(),
          },
        },
      });

      await refetch();
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully! 💕");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handlePickImage = async () => {
    try {
      console.log("Starting image pick...");
      const result = await pickImage();
      console.log("Image pick result:", result);

      if (result) {
        console.log("Converting to GraphQL upload...");
        const uploadFile = await convertToGraphQLUpload(result);
        console.log("Upload file created:", uploadFile);

        console.log("Uploading to server...");
        const uploadResult = await uploadAvatar({
          variables: {
            input: {
              avatar: uploadFile,
            },
          },
        });
        console.log("Upload result:", uploadResult);

        await refetch();
        Alert.alert("Success", "Avatar updated successfully! 💕");
      } else {
        console.log("No image selected");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        `Failed to upload avatar: ${error?.message || "Unknown error"}`
      );
    }
  };

  const handleTakePhoto = async () => {
    try {
      console.log("Starting photo capture...");
      const result = await takePhoto();
      console.log("Photo capture result:", result);

      if (result) {
        console.log("Converting to GraphQL upload...");
        const uploadFile = await convertToGraphQLUpload(result);
        console.log("Upload file created:", uploadFile);

        console.log("Uploading to server...");
        const uploadResult = await uploadAvatar({
          variables: {
            input: {
              avatar: uploadFile,
            },
          },
        });
        console.log("Upload result:", uploadResult);

        await refetch();
        Alert.alert("Success", "Avatar updated successfully! 💕");
      } else {
        console.log("No photo taken");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        `Failed to upload avatar: ${error?.message || "Unknown error"}`
      );
    }
  };

  const handleDeleteAvatar = async () => {
    Alert.alert(
      "Delete Avatar",
      "Are you sure you want to delete your avatar?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAvatar();
              await refetch();
              Alert.alert("Success", "Avatar deleted successfully!");
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete avatar. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const showAvatarOptions = () => {
    Alert.alert("Update Avatar", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: "Take Photo", onPress: handleTakePhoto },
      { text: "Choose from Gallery", onPress: handlePickImage },
      ...(currentUser?.avatarUrl
        ? [
            {
              text: "Delete Avatar",
              onPress: handleDeleteAvatar,
              style: "destructive" as const,
            },
          ]
        : []),
    ]);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#FFF5F5" }}>
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
                <TouchableOpacity onPress={showAvatarOptions}>
                  <Image
                    source={
                      currentUser?.avatarUrl
                        ? { uri: currentUser.avatarUrl }
                        : require("../../assets/images/logo.png")
                    }
                    className="w-20 h-20 rounded-full mr-4 border-4 border-red-400"
                    resizeMode="cover"
                  />
                  <View className="absolute -bottom-1 -right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                    <Ionicons name="camera" size={12} color="white" />
                  </View>
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-900">
                    {currentUser?.name || "No Name Set"}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {currentUser?.email || "No Email"}
                  </Text>
                  <Text className="text-sm text-red-500 font-semibold">
                    {currentUser?.partner
                      ? `💕 In Love with ${
                          currentUser.partner.name || "Partner"
                        }`
                      : "💔 Single"}
                  </Text>
                </View>
                <TouchableOpacity
                  className="border border-red-500 px-4 py-2 rounded-full"
                  onPress={handleEditProfile}
                >
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

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Edit Profile
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              value={editName}
              onChangeText={setEditName}
              editable={!isEditing}
              placeholder="Enter your name"
            />
            <TouchableOpacity
              className="bg-red-500 py-3 px-6 rounded-lg"
              onPress={handleSaveProfile}
              disabled={isEditing}
            >
              <Text className="text-white font-bold text-center text-lg">
                {isEditing ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 py-3 px-6 rounded-lg mt-3"
              onPress={() => setEditModalVisible(false)}
            >
              <Text className="text-gray-800 font-bold text-center text-lg">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
