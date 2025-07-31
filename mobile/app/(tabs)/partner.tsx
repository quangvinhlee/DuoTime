import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PartnerPage() {
  const [hasPartner, setHasPartner] = useState(false); // Control partner state

  if (!hasPartner) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF5F5" }}>
        <ScrollView className="flex-1">
          <View className="p-4">
            {/* Header Section with Connection Status */}
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
                    Ready to Connect
                  </Text>
                  <Text className="text-white text-sm opacity-80">
                    • Share your code with your love
                  </Text>
                </View>
              </View>

              {/* Your Profile */}
              <View className="flex-row items-center justify-between mb-6">
                {/* Your Avatar */}
                <View className="items-center">
                  <View
                    className="w-20 h-20 rounded-full border-4 items-center justify-center mb-2"
                    style={{
                      backgroundColor: "#FFF5F5",
                      borderColor: "#FF6B6B",
                    }}
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
                    Waiting
                  </Text>
                </View>

                {/* Partner Avatar (Empty) */}
                <View className="items-center">
                  <View
                    className="w-20 h-20 rounded-full border-4 items-center justify-center mb-2"
                    style={{
                      backgroundColor: "#FFF5F5",
                      borderColor: "#E2E8F0",
                    }}
                  >
                    <Ionicons
                      name="person-add"
                      size={24}
                      style={{ color: "#A0AEC0" }}
                    />
                  </View>
                  <Text
                    className="text-sm font-bold"
                    style={{ color: "#A0AEC0" }}
                  >
                    Partner
                  </Text>
                </View>
              </View>

              {/* Welcome Message */}
              <View className="items-center">
                <Text
                  className="text-lg font-semibold text-center"
                  style={{ color: "#2D3748" }}
                >
                  Ready to find your love? 💕
                </Text>
                <Text className="text-center mt-1" style={{ color: "#718096" }}>
                  Share your code or search for your partner
                </Text>
              </View>
            </View>

            {/* Your Connection Code Section */}
            <View className="mb-6">
              <View
                className="bg-white rounded-2xl shadow-md border-2 p-6"
                style={{ borderColor: "#FFB3B3" }}
              >
                <Text
                  className="text-xl font-semibold text-center mb-6"
                  style={{ color: "#2D3748" }}
                >
                  📱 Your Connection Code
                </Text>

                <View className="items-center mb-6">
                  {/* QR Code Placeholder */}
                  <View
                    className="w-48 h-48 bg-gray-100 rounded-2xl items-center justify-center mb-4"
                    style={{ backgroundColor: "#FFF5F5" }}
                  >
                    <Ionicons
                      name="qr-code"
                      size={80}
                      style={{ color: "#FF6B6B" }}
                    />
                    <Text className="text-sm mt-2" style={{ color: "#718096" }}>
                      QR Code
                    </Text>
                  </View>

                  {/* Connection Code */}
                  <View
                    className="bg-gray-50 rounded-xl p-4 mb-4"
                    style={{ backgroundColor: "#FFF5F5" }}
                  >
                    <Text
                      className="text-center text-sm mb-2"
                      style={{ color: "#718096" }}
                    >
                      Your Code
                    </Text>
                    <Text
                      className="text-center font-mono text-lg font-bold"
                      style={{ color: "#2D3748" }}
                    >
                      DTO-1234-5678
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="py-3 px-6 rounded-xl"
                    style={{ backgroundColor: "#FF6B6B" }}
                  >
                    <Text className="text-white font-semibold">
                      🔄 Generate New Code
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Search Partner Section */}
            <View className="mb-6">
              <View
                className="bg-white rounded-2xl shadow-md border-2 p-6"
                style={{ borderColor: "#FFB3B3" }}
              >
                <Text
                  className="text-xl font-semibold text-center mb-6"
                  style={{ color: "#2D3748" }}
                >
                  🔍 Find Your Partner
                </Text>

                <View className="space-y-4">
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <Ionicons
                        name="search"
                        size={20}
                        style={{ color: "#718096" }}
                      />
                    </View>
                    <TextInput
                      placeholder="Enter partner's code..."
                      className="pl-10 pr-4 py-4 border rounded-xl"
                      style={{
                        borderColor: "#FFB3B3",
                        backgroundColor: "#FFF5F5",
                        color: "#2D3748",
                      }}
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>

                  <TouchableOpacity
                    className="py-4 px-6 rounded-xl items-center"
                    style={{ backgroundColor: "#FF6B6B" }}
                  >
                    <Text className="text-white font-semibold text-lg">
                      🔍 Connect with Partner
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Share Options */}
            <View className="mb-6">
              <Text
                className="text-xl font-semibold text-center mb-6"
                style={{ color: "#2D3748" }}
              >
                Share Your Code
              </Text>

              <View className="space-y-4">
                <TouchableOpacity
                  className="bg-white rounded-2xl shadow-md border-2 p-6"
                  style={{ borderColor: "#FFB3B3" }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: "#FF6B6B" }}
                    >
                      <Ionicons name="share-social" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-lg"
                        style={{ color: "#2D3748" }}
                      >
                        Share via Message
                      </Text>
                      <Text className="text-sm" style={{ color: "#718096" }}>
                        Send your code through text or social media
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      style={{ color: "#718096" }}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white rounded-2xl shadow-md border-2 p-6"
                  style={{ borderColor: "#FFB3B3" }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: "#FF8E8E" }}
                    >
                      <Ionicons name="copy" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-lg"
                        style={{ color: "#2D3748" }}
                      >
                        Copy Code
                      </Text>
                      <Text className="text-sm" style={{ color: "#718096" }}>
                        Copy your connection code to clipboard
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      style={{ color: "#718096" }}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white rounded-2xl shadow-md border-2 p-6"
                  style={{ borderColor: "#FFB3B3" }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: "#FF6B6B" }}
                    >
                      <Ionicons name="mail" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-lg"
                        style={{ color: "#2D3748" }}
                      >
                        Email Invitation
                      </Text>
                      <Text className="text-sm" style={{ color: "#718096" }}>
                        Send a romantic email invitation
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      style={{ color: "#718096" }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Benefits Card */}
            <View className="mb-8">
              <View
                className="bg-white rounded-2xl shadow-md border-2 p-6"
                style={{ borderColor: "#FFB3B3" }}
              >
                <Text
                  className="text-xl font-semibold text-center mb-6"
                  style={{ color: "#2D3748" }}
                >
                  💕 Why Connect with DuoTime?
                </Text>

                <View className="space-y-4">
                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: "#FF6B6B" }}
                    >
                      <Ionicons name="heart" size={16} color="white" />
                    </View>
                    <Text className="flex-1" style={{ color: "#2D3748" }}>
                      Send love reminders and sweet messages
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: "#FF8E8E" }}
                    >
                      <Ionicons name="gift" size={16} color="white" />
                    </View>
                    <Text className="flex-1" style={{ color: "#2D3748" }}>
                      Plan surprises and special moments
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: "#FF6B6B" }}
                    >
                      <Ionicons name="calendar" size={16} color="white" />
                    </View>
                    <Text className="flex-1" style={{ color: "#2D3748" }}>
                      Track important dates and milestones
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Demo Button */}
            <View className="items-center mb-8">
              <TouchableOpacity
                onPress={() => setHasPartner(true)}
                className="py-4 px-8 rounded-xl"
                style={{ backgroundColor: "#FF6B6B" }}
              >
                <Text className="text-white font-semibold text-lg">
                  🎭 Try Demo Mode
                </Text>
              </TouchableOpacity>
              <Text
                className="text-sm text-center mt-3"
                style={{ color: "#A0AEC0" }}
              >
                Experience the full features with a demo partner
              </Text>
            </View>

            {/* Love Quote */}
            <View
              className="bg-white rounded-2xl shadow-md border-2 p-6"
              style={{ borderColor: "#FFB3B3" }}
            >
              <View className="items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: "#FFF5F5" }}
                >
                  <Ionicons name="heart" size={24} color="#FF6B6B" />
                </View>
                <Text
                  className="text-center font-medium italic mb-3"
                  style={{ color: "#2D3748" }}
                >
                  "The best thing to hold onto in life is each other."
                </Text>
                <Text className="text-sm" style={{ color: "#718096" }}>
                  Audrey Hepburn
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Original partner page content with updated theme
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF5F5" }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="pt-12 pb-4">
            <Text className="text-2xl font-bold" style={{ color: "#2D3748" }}>
              My Love
            </Text>
            <Text className="text-sm mt-1" style={{ color: "#718096" }}>
              Connect and share love with your special someone
            </Text>
          </View>

          {/* Search */}
          <View className="mb-4">
            <View className="relative">
              <View className="absolute left-3 top-3 z-10">
                <Ionicons
                  name="search"
                  size={20}
                  style={{ color: "#718096" }}
                />
              </View>
              <TextInput
                placeholder="Search love notes..."
                className="pl-10 pr-4 py-3 border rounded-lg"
                style={{
                  borderColor: "#FFB3B3",
                  backgroundColor: "white",
                  color: "#2D3748",
                }}
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          {/* Current Partner */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold mb-3"
              style={{ color: "#2D3748" }}
            >
              My Beloved
            </Text>

            <View
              className="bg-white rounded-2xl p-6 shadow-md border-2"
              style={{ borderColor: "#FFB3B3" }}
            >
              <View className="flex-row items-center mb-4">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                  }}
                  className="w-20 h-20 rounded-full mr-4"
                  style={{ borderColor: "#FF6B6B", borderWidth: 4 }}
                />
                <View className="flex-1">
                  <Text
                    className="text-xl font-bold"
                    style={{ color: "#2D3748" }}
                  >
                    Sarah Johnson
                  </Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: "#38A169" }}
                  >
                    💕 Online • Available for love
                  </Text>
                  <Text className="text-sm" style={{ color: "#718096" }}>
                    Computer Science • University of Tech
                  </Text>
                </View>
              </View>

              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 py-3 px-4 rounded-full"
                  style={{ backgroundColor: "#FF6B6B" }}
                >
                  <Text className="text-white font-semibold text-center">
                    💝 Send Love
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 border py-3 px-4 rounded-full"
                  style={{ borderColor: "#FF6B6B" }}
                >
                  <Text
                    className="font-semibold text-center"
                    style={{ color: "#FF6B6B" }}
                  >
                    💌 Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Love Stats */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold mb-3"
              style={{ color: "#2D3748" }}
            >
              Our Love Journey
            </Text>

            <View className="flex-row space-x-4">
              <View
                className="flex-1 bg-white rounded-2xl p-4 items-center shadow-md border-2"
                style={{ borderColor: "#FFB3B3" }}
              >
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#FF6B6B" }}
                >
                  24
                </Text>
                <Text
                  className="text-sm text-center"
                  style={{ color: "#718096" }}
                >
                  Love Notes Sent
                </Text>
              </View>

              <View
                className="flex-1 bg-white rounded-2xl p-4 items-center shadow-md border-2"
                style={{ borderColor: "#FFB3B3" }}
              >
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#FF8E8E" }}
                >
                  18.5h
                </Text>
                <Text
                  className="text-sm text-center"
                  style={{ color: "#718096" }}
                >
                  Time Together
                </Text>
              </View>

              <View
                className="flex-1 bg-white rounded-2xl p-4 items-center shadow-md border-2"
                style={{ borderColor: "#FFB3B3" }}
              >
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#FF6B6B" }}
                >
                  92%
                </Text>
                <Text
                  className="text-sm text-center"
                  style={{ color: "#718096" }}
                >
                  Love Match
                </Text>
              </View>
            </View>
          </View>

          {/* Love Activities */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold mb-3"
              style={{ color: "#2D3748" }}
            >
              Love Activities
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                className="bg-white rounded-2xl p-4 shadow-md border-2"
                style={{ borderColor: "#FFB3B3" }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: "#FFF5F5" }}
                  >
                    <Text className="text-xl">💕</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{ color: "#2D3748" }}
                    >
                      Send Love Reminder
                    </Text>
                    <Text className="text-sm" style={{ color: "#718096" }}>
                      Set a sweet reminder for your love
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    style={{ color: "#718096" }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white rounded-2xl p-4 shadow-md border-2"
                style={{ borderColor: "#FFB3B3" }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: "#FFF5F5" }}
                  >
                    <Text className="text-xl">🎁</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{ color: "#2D3748" }}
                    >
                      Plan Surprise
                    </Text>
                    <Text className="text-sm" style={{ color: "#718096" }}>
                      Create a special surprise moment
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    style={{ color: "#718096" }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white rounded-2xl p-4 shadow-md border-2"
                style={{ borderColor: "#FFB3B3" }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: "#FFF5F5" }}
                  >
                    <Text className="text-xl">💌</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{ color: "#2D3748" }}
                    >
                      Love Notes
                    </Text>
                    <Text className="text-sm" style={{ color: "#718096" }}>
                      Write a romantic message
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    style={{ color: "#718096" }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Love Calendar */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold mb-3"
              style={{ color: "#2D3748" }}
            >
              Love Calendar
            </Text>

            <View
              className="bg-white rounded-2xl p-6 shadow-md border-2"
              style={{ borderColor: "#FFB3B3" }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className="text-lg font-bold"
                  style={{ color: "#2D3748" }}
                >
                  Special Dates
                </Text>
                <TouchableOpacity
                  className="px-4 py-2 rounded-full"
                  style={{ backgroundColor: "#FF6B6B" }}
                >
                  <Text className="text-white font-semibold text-sm">
                    + Add
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-3">
                <View
                  className="flex-row items-center p-3 rounded-xl"
                  style={{ backgroundColor: "#FFF5F5" }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#FF6B6B" }}
                  >
                    <Text className="text-white font-bold">❤️</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{ color: "#2D3748" }}
                    >
                      Anniversary
                    </Text>
                    <Text className="text-sm" style={{ color: "#718096" }}>
                      March 15, 2024 • 2 months away
                    </Text>
                  </View>
                </View>

                <View
                  className="flex-row items-center p-3 rounded-xl"
                  style={{ backgroundColor: "#FFF5F5" }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#FF8E8E" }}
                  >
                    <Text className="text-white font-bold">🎂</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{ color: "#2D3748" }}
                    >
                      Sarah&apos;s Birthday
                    </Text>
                    <Text className="text-sm" style={{ color: "#718096" }}>
                      April 22, 2024 • 3 months away
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Love Goals */}
          <View className="mb-6">
            <Text
              className="text-lg font-semibold mb-3"
              style={{ color: "#2D3748" }}
            >
              Love Goals
            </Text>

            <View
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-white">
                  💕 Our Goals
                </Text>
                <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                  <Text
                    className="font-bold text-sm"
                    style={{ color: "#FF6B6B" }}
                  >
                    5
                  </Text>
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
            <Text
              className="text-lg font-semibold mb-3"
              style={{ color: "#2D3748" }}
            >
              Quick Love Actions
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                className="py-4 px-6 rounded-2xl"
                style={{ backgroundColor: "#FF6B6B" }}
              >
                <Text className="text-white font-bold text-center text-lg">
                  💝 Send Love Reminder
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="border py-4 px-6 rounded-2xl"
                style={{ borderColor: "#FF6B6B" }}
              >
                <Text
                  className="font-bold text-center text-lg"
                  style={{ color: "#FF6B6B" }}
                >
                  💌 Write Love Note
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Love Quote */}
          <View
            className="rounded-2xl p-6 shadow-md border-2 mb-6"
            style={{ backgroundColor: "#FFF5F5", borderColor: "#FFB3B3" }}
          >
            <View className="items-center">
              <Text className="text-3xl mb-4">💖</Text>
              <Text
                className="text-base text-center italic leading-6 mb-4"
                style={{ color: "#2D3748" }}
              >
                &apos;Love is not about finding the perfect person, but about
                seeing an imperfect person perfectly.&apos;
              </Text>
              <View
                className="rounded-xl px-4 py-2"
                style={{ backgroundColor: "#FFB3B3" }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: "#FF6B6B" }}
                >
                  💕 Love Quote
                </Text>
              </View>
            </View>
          </View>

          {/* Demo Toggle */}
          <View className="items-center mb-6">
            <TouchableOpacity
              onPress={() => setHasPartner(false)}
              className="py-3 px-6 rounded-xl"
              style={{ backgroundColor: "#718096" }}
            >
              <Text className="text-white font-semibold">
                🔄 Back to Find Partner
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
