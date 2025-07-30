import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PartnerPage() {
  return (
    <View className="flex-1 bg-pink-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="pt-12 pb-4">
            <Text className="text-2xl font-bold text-gray-900">My Love</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Connect and share love with your special someone
            </Text>
          </View>

          {/* Search */}
          <View className="mb-4">
            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Ionicons name="search" size={20} color="#6b7280" />
              </View>
              <TextInput
                placeholder="Search love notes..."
                className="pl-10 pr-4 py-3 border border-pink-300 rounded-lg bg-white"
              />
            </View>
          </View>

          {/* Current Partner */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              My Beloved
            </Text>

            <View className="bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl p-6 border border-pink-200">
              <View className="flex-row items-center mb-4">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                  }}
                  className="w-20 h-20 rounded-full mr-4 border-4 border-red-400"
                />
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-900">
                    Sarah Johnson
                  </Text>
                  <Text className="text-sm text-green-500 font-semibold">
                    💕 Online • Available for love
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Computer Science • University of Tech
                  </Text>
                </View>
              </View>

              <View className="flex-row space-x-3">
                <TouchableOpacity className="flex-1 bg-red-500 py-3 px-4 rounded-full">
                  <Text className="text-white font-semibold text-center">
                    💝 Send Love
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 border border-red-500 py-3 px-4 rounded-full">
                  <Text className="text-red-500 font-semibold text-center">
                    💌 Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Love Stats */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Our Love Journey
            </Text>

            <View className="flex-row space-x-4">
              <View className="flex-1 bg-pink-50 rounded-2xl p-4 items-center border border-pink-200">
                <Text className="text-2xl font-bold text-pink-500">24</Text>
                <Text className="text-sm text-gray-600 text-center">
                  Love Notes Sent
                </Text>
              </View>

              <View className="flex-1 bg-red-50 rounded-2xl p-4 items-center border border-red-200">
                <Text className="text-2xl font-bold text-red-500">18.5h</Text>
                <Text className="text-sm text-gray-600 text-center">
                  Time Together
                </Text>
              </View>

              <View className="flex-1 bg-purple-50 rounded-2xl p-4 items-center border border-purple-200">
                <Text className="text-2xl font-bold text-purple-500">92%</Text>
                <Text className="text-sm text-gray-600 text-center">
                  Love Match
                </Text>
              </View>
            </View>
          </View>

          {/* Love Activities */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Activities
            </Text>

            <View className="space-y-3">
              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">💕</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      Send Love Reminder
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Set a sweet reminder for your love
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">🎁</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      Plan Surprise
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Create a special surprise moment
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">💌</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      Love Notes
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Write a romantic message
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Love Calendar */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Calendar
            </Text>

            <View className="bg-white rounded-2xl p-6 border border-pink-200 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">
                  Special Dates
                </Text>
                <TouchableOpacity className="bg-pink-500 px-4 py-2 rounded-full">
                  <Text className="text-white font-semibold text-sm">
                    + Add
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-3">
                <View className="flex-row items-center p-3 bg-pink-50 rounded-xl">
                  <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">❤️</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      Anniversary
                    </Text>
                    <Text className="text-sm text-gray-600">
                      March 15, 2024 • 2 months away
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center p-3 bg-blue-50 rounded-xl">
                  <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">🎂</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      Sarah&apos;s Birthday
                    </Text>
                    <Text className="text-sm text-gray-600">
                      April 22, 2024 • 3 months away
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Love Goals */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Love Goals
            </Text>

            <View className="bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl p-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-white">
                  💕 Our Goals
                </Text>
                <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                  <Text className="text-red-500 font-bold text-sm">5</Text>
                </View>
              </View>

              <View className="space-y-3">
                <View className="bg-white bg-opacity-20 rounded-xl p-3">
                  <Text className="text-white font-semibold">
                    🌟 Plan a romantic getaway
                  </Text>
                  <View className="bg-white bg-opacity-30 rounded-full h-2 mt-2">
                    <View className="bg-white rounded-full h-2 w-3/4" />
                  </View>
                </View>

                <View className="bg-white bg-opacity-20 rounded-xl p-3">
                  <Text className="text-white font-semibold">
                    💍 Save for engagement ring
                  </Text>
                  <View className="bg-white bg-opacity-30 rounded-full h-2 mt-2">
                    <View className="bg-white rounded-full h-2 w-1/2" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Love Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Quick Love Actions
            </Text>

            <View className="space-y-3">
              <TouchableOpacity className="bg-red-500 py-4 px-6 rounded-2xl">
                <Text className="text-white font-bold text-center text-lg">
                  💝 Send Love Reminder
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-red-500 py-4 px-6 rounded-2xl">
                <Text className="text-red-500 font-bold text-center text-lg">
                  💌 Write Love Note
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Love Quote */}
          <View className="bg-gradient-to-r from-pink-300 to-red-300 rounded-2xl p-6 border border-red-200 mb-6">
            <View className="items-center">
              <Text className="text-3xl mb-4">💖</Text>
              <Text className="text-base text-gray-800 text-center italic leading-6 mb-4">
                &apos;Love is not about finding the perfect person, but about
                seeing an imperfect person perfectly.&apos;
              </Text>
              <View className="bg-red-200 rounded-xl px-4 py-2">
                <Text className="text-xs font-bold text-red-600">
                  💕 Love Quote
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
