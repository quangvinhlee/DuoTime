import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF5F5" }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header Section with Couple Connection */}
          <View
            className="bg-white rounded-2xl p-6 mb-6 shadow-md border-2"
            style={{ borderColor: "#FFB3B3" }}
          >
            {/* Connection Status Bar */}
            <View
              className="rounded-xl p-3 mb-5"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <View className="w-2 h-2 bg-green-400 rounded-full" />
                <Text className="text-white font-bold text-sm">
                  Connected to Sarah
                </Text>
                <Text className="text-white text-sm opacity-80">
                  • Active 2 min ago
                </Text>
              </View>
            </View>

            {/* Couple Avatars with Heart Connection */}
            <View className="flex-row items-center justify-between mb-6">
              {/* Your Avatar */}
              <View className="items-center">
                <View
                  className="w-20 h-20 rounded-full border-4 items-center justify-center mb-2"
                  style={{ backgroundColor: "#FFF5F5", borderColor: "#FF6B6B" }}
                >
                  <Text className="text-3xl">👤</Text>
                </View>
                <Text
                  className="text-sm font-bold"
                  style={{ color: "#2D3748" }}
                >
                  You
                </Text>
              </View>

              {/* Heart Connection */}
              <View className="items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-1"
                  style={{ backgroundColor: "#FFB3B3" }}
                >
                  <Text className="text-2xl">💕</Text>
                </View>
                <Text
                  className="text-xs font-bold"
                  style={{ color: "#FF6B6B" }}
                >
                  Connected
                </Text>
              </View>

              {/* Partner Avatar */}
              <View className="items-center">
                <View
                  className="w-20 h-20 rounded-full border-4 items-center justify-center mb-2"
                  style={{ backgroundColor: "#FFF5F5", borderColor: "#FF8E8E" }}
                >
                  <Text className="text-3xl">👤</Text>
                </View>
                <Text
                  className="text-sm font-bold"
                  style={{ color: "#2D3748" }}
                >
                  Sarah
                </Text>
              </View>
            </View>

            {/* Welcome Message */}
            <View className="items-center">
              <Text
                className="text-lg font-semibold text-center"
                style={{ color: "#2D3748" }}
              >
                Good morning, lovebirds! 🌅
              </Text>
              <Text className="text-center mt-1" style={{ color: "#718096" }}>
                Ready to spread some love today?
              </Text>
            </View>
          </View>

          {/* Active Love Reminder Card */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            {/* Header with Status */}
            <View className="flex-row items-center mb-4">
              <View className="w-3 h-3 bg-red-500 rounded-full mr-3" />
              <Text className="text-lg font-semibold text-gray-800">
                Your Love Reminder to Sarah
              </Text>
            </View>

            {/* Reminder Content */}
            <Text className="text-base font-bold text-gray-800 mb-4">
              Don't forget to take your vitamins, my love! 💊❤️
            </Text>

            {/* Countdown Display */}
            <View className="bg-pink-100 rounded-2xl p-6 mb-4">
              <Text className="text-4xl text-center mb-3">⏰</Text>

              {/* Time Display */}
              <View className="flex-row justify-between mb-4">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-red-500">01</Text>
                  <Text className="text-xs text-gray-600">Hours</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-red-500">23</Text>
                  <Text className="text-xs text-gray-600">Minutes</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-red-500">45</Text>
                  <Text className="text-xs text-gray-600">Seconds</Text>
                </View>
              </View>

              <Text className="text-sm text-center text-gray-700 mb-3">
                until Sarah gets your sweet reminder
              </Text>

              {/* Progress Bar */}
              <View className="bg-red-200 rounded-full h-2">
                <View className="bg-red-500 rounded-full h-2 w-2/3" />
              </View>
            </View>

            {/* Reminder Details */}
            <View className="bg-gray-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center">
                <Text className="text-xl mr-4">📅</Text>
                <View>
                  <Text className="font-bold text-gray-800">
                    Today at 3:00 PM
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Health Reminder • Daily
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center space-x-3">
              <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold text-sm">
                  ✏️ Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-purple-500 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold text-sm">
                  ⏰ Reschedule
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-full">
                <Text className="text-gray-600 font-semibold text-sm">
                  ❌ Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Surprise Reminders Indicator */}
          <View className="bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl p-6 mb-6">
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-start flex-1">
                <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center mr-4">
                  <Text className="text-lg">🎁</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white mb-1">
                    Surprise Reminders Waiting!
                  </Text>
                  <Text className="text-white opacity-90">
                    Sarah has prepared some lovely surprises for you 💕
                  </Text>
                </View>
              </View>
              <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                <Text className="text-red-500 font-bold text-sm">3</Text>
              </View>
            </View>

            {/* Animated Dots */}
            <View className="flex-row justify-center space-x-2 mt-4">
              <View className="w-2 h-2 bg-white rounded-full" />
              <View className="w-2 h-2 bg-white opacity-50 rounded-full" />
              <View className="w-2 h-2 bg-white opacity-50 rounded-full" />
            </View>

            <Text className="text-white text-center text-sm mt-2 opacity-80">
              You'll be notified when it's time
            </Text>
          </View>

          {/* Love Stats */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 text-center mb-5">
              📊 Today&apos;s Love Exchange
            </Text>

            <View className="flex-row space-x-4">
              {/* Sent Stats */}
              <View className="flex-1 bg-blue-50 rounded-2xl p-4 items-center">
                <View className="w-12 h-12 bg-blue-400 rounded-full items-center justify-center mb-3">
                  <Text className="text-xl">📤</Text>
                </View>
                <Text className="text-2xl font-bold text-blue-500 mb-1">3</Text>
                <Text className="text-xs text-gray-600 text-center">
                  Sent to Sarah
                </Text>
              </View>

              {/* Surprise Stats */}
              <View className="flex-1 bg-pink-50 rounded-2xl p-4 items-center">
                <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center mb-3">
                  <Text className="text-xl text-white">🎁</Text>
                </View>
                <Text className="text-2xl font-bold text-red-500 mb-1">3</Text>
                <Text className="text-xs text-gray-600 text-center">
                  Surprises Coming
                </Text>
              </View>

              {/* Completion Stats */}
              <View className="flex-1 bg-green-50 rounded-2xl p-4 items-center">
                <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mb-3">
                  <Text className="text-xl text-white">✅</Text>
                </View>
                <Text className="text-2xl font-bold text-green-500 mb-1">
                  100%
                </Text>
                <Text className="text-xs text-gray-600 text-center">
                  Completed
                </Text>
              </View>
            </View>

            {/* Love Streak */}
            <View className="bg-gray-50 rounded-xl p-4 mt-4">
              <View className="flex-row items-center justify-center space-x-3">
                <Text className="text-lg">🔥</Text>
                <Text className="font-bold text-gray-800">
                  7-day love streak!
                </Text>
                <Text className="text-sm text-gray-600">Keep it up!</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </Text>

            <View className="space-y-4">
              <View className="flex-row space-x-4">
                <TouchableOpacity className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
                  <View className="items-center">
                    <Text className="text-3xl mb-2">📋</Text>
                    <Text className="font-bold text-gray-800 text-center">
                      My Reminders
                    </Text>
                    <Text className="text-xs text-gray-600 text-center">
                      View all active
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
                  <View className="items-center">
                    <Text className="text-3xl mb-2">📅</Text>
                    <Text className="font-bold text-gray-800 text-center">
                      Calendar
                    </Text>
                    <Text className="text-xs text-gray-600 text-center">
                      Plan together
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-row space-x-4">
                <TouchableOpacity className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
                  <View className="items-center">
                    <Text className="text-3xl mb-2">💌</Text>
                    <Text className="font-bold text-gray-800 text-center">
                      Love Notes
                    </Text>
                    <Text className="text-xs text-gray-600 text-center">
                      Send a message
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
                  <View className="items-center">
                    <Text className="text-3xl mb-2">💑</Text>
                    <Text className="font-bold text-gray-800 text-center">
                      Settings
                    </Text>
                    <Text className="text-xs text-gray-600 text-center">
                      Couple preferences
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Love Quote */}
          <View className="bg-gradient-to-r from-pink-300 to-red-300 rounded-2xl p-6 border border-red-200">
            <View className="items-center">
              <Text className="text-3xl mb-4">💝</Text>
              <Text className="text-base text-gray-800 text-center italic leading-6 mb-4">
                &apos;The best surprise is the one that comes from the heart
                when you least expect it.&apos;
              </Text>
              <View className="bg-red-200 rounded-xl px-4 py-2">
                <Text className="text-xs font-bold text-red-600">
                  💕 Love Quote of the Day
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-red-500 rounded-full items-center justify-center shadow-lg">
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
