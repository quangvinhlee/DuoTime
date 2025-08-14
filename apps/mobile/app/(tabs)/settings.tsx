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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../store/auth";
import {
  useGetProfileWithPartnerQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from "@/generated/graphql";
import {
  pickImage,
  takePhoto,
  convertToBase64,
} from "@/graphql/utils/fileUpload";

export default function SettingsPage() {
  const { user, logout, setAuth } = useAuthStore();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [avatarOptionsModalVisible, setAvatarOptionsModalVisible] =
    useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      const result = await updateProfile({
        variables: {
          input: {
            name: editName.trim(),
          },
        },
      });

      if (result.data?.updateProfile?.success) {
        await refetch();
        setEditModalVisible(false);
        Alert.alert("Success", "Profile updated successfully! 💕");
      } else {
        Alert.alert(
          "Error",
          result.data?.updateProfile?.message || "Failed to update profile"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handlePickImage = async () => {
    if (isUploading) return; // Prevent multiple uploads

    try {
      const result = await pickImage();

      if (result) {
        const base64 = await convertToBase64(result);

        // Only show loading when actually uploading to server
        setIsUploading(true);
        const uploadResult = await uploadAvatar({
          variables: {
            input: {
              avatarBase64: base64,
            },
          },
        });

        if (uploadResult.data?.uploadAvatar?.success) {
          await refetch();
          Alert.alert("Success", "Avatar updated successfully! 💕");
        } else {
          Alert.alert(
            "Error",
            uploadResult.data?.uploadAvatar?.message ||
              "Failed to upload avatar"
          );
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        `Failed to upload avatar: ${error?.message || "Unknown error"}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (isUploading) return; // Prevent multiple uploads

    try {
      const result = await takePhoto();

      if (result) {
        const base64 = await convertToBase64(result);

        // Only show loading when actually uploading to server
        setIsUploading(true);
        const uploadResult = await uploadAvatar({
          variables: {
            input: {
              avatarBase64: base64,
            },
          },
        });

        if (uploadResult.data?.uploadAvatar?.success) {
          await refetch();
          Alert.alert("Success", "Avatar updated successfully! 💕");
        } else {
          Alert.alert(
            "Error",
            uploadResult.data?.uploadAvatar?.message ||
              "Failed to upload avatar"
          );
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        `Failed to upload avatar: ${error?.message || "Unknown error"}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (isUploading) return; // Prevent multiple operations

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
              setIsUploading(true);
              const result = await deleteAvatar();

              // Force refetch and wait for it
              await refetch();

              // Also update the auth store if needed
              if (user && result?.data?.deleteAvatar?.success) {
                // Update the user in auth store to remove avatar
                const updatedUser = { ...user, avatarUrl: null };
                // Get the current token from the store
                const currentToken = useAuthStore.getState().token;
                if (currentToken) {
                  await setAuth(currentToken, updatedUser);
                }
              }
              Alert.alert("Success", "Avatar deleted successfully!");
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete avatar. Please try again."
              );
            } finally {
              setIsUploading(false);
            }
          },
        },
      ]
    );
  };

  const showAvatarOptions = () => {
    if (isUploading) {
      Alert.alert("Uploading", "Please wait while we process your avatar...");
      return;
    }

    setAvatarOptionsModalVisible(true);
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
                <TouchableOpacity
                  onPress={showAvatarOptions}
                  disabled={isUploading}
                >
                  <View className="relative">
                    {currentUser?.avatarUrl ? (
                      <Image
                        source={{ uri: currentUser.avatarUrl }}
                        className="w-20 h-20 rounded-full mr-4 border-4 border-red-400"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-20 h-20 rounded-full mr-4 border-4 border-red-400 bg-gray-200 items-center justify-center">
                        <Ionicons name="person" size={32} color="#6b7280" />
                      </View>
                    )}
                    <View className="absolute -top-2 -left-2 bg-red-500 rounded-full w-7 h-7 items-center justify-center">
                      <Ionicons name="camera" size={14} color="white" />
                    </View>
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
                  disabled={isUploading}
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

      {/* Loading Modal Overlay */}
      {isUploading && (
        <View className="absolute inset-0 backdrop-blur-sm items-center justify-center z-50">
          <View className="bg-white rounded-2xl p-6 items-center shadow-xl border border-gray-100 mx-4">
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text className="text-lg font-semibold text-gray-800 mt-4">
              Uploading Avatar...
            </Text>
            <Text className="text-sm text-gray-600 mt-2 text-center">
              Please wait while we process your image
            </Text>
          </View>
        </View>
      )}

      {/* Avatar Options Modal */}
      <Modal
        visible={avatarOptionsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAvatarOptionsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <Text className="text-xl font-bold text-gray-900 mb-4 text-center">
              Update Avatar
            </Text>

            <TouchableOpacity
              className="bg-red-500 py-3 px-6 rounded-lg mb-3"
              onPress={() => {
                setAvatarOptionsModalVisible(false);
                handleTakePhoto();
              }}
            >
              <Text className="text-white font-bold text-center text-lg">
                📷 Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-lg mb-3"
              onPress={() => {
                setAvatarOptionsModalVisible(false);
                handlePickImage();
              }}
            >
              <Text className="text-white font-bold text-center text-lg">
                🖼️ Choose from Gallery
              </Text>
            </TouchableOpacity>

            {currentUser?.avatarUrl && (
              <TouchableOpacity
                className="bg-red-600 py-3 px-6 rounded-lg mb-3"
                onPress={() => {
                  setAvatarOptionsModalVisible(false);
                  handleDeleteAvatar();
                }}
              >
                <Text className="text-white font-bold text-center text-lg">
                  🗑️ Remove Avatar
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-gray-300 py-3 px-6 rounded-lg"
              onPress={() => setAvatarOptionsModalVisible(false)}
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
