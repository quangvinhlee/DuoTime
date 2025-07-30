import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RemindersPage() {
  const [activeReminders] = useState([
    {
      id: 1,
      title: "Take vitamins, my love! 💊",
      time: "3:00 PM",
      date: "Today",
      type: "health",
      for: "Sarah",
      status: "active",
    },
    {
      id: 2,
      title: "Don't forget the anniversary gift! 🎁",
      time: "6:00 PM",
      date: "Tomorrow",
      type: "romance",
      for: "Sarah",
      status: "active",
    },
    {
      id: 3,
      title: "Call mom together 💕",
      time: "7:30 PM",
      date: "Today",
      type: "family",
      for: "Both",
      status: "active",
    },
  ]);

  const [completedReminders] = useState([
    {
      id: 4,
      title: "Morning coffee together ☕",
      time: "8:00 AM",
      date: "Today",
      type: "daily",
      for: "Both",
      status: "completed",
    },
    {
      id: 5,
      title: "Grocery shopping 🛒",
      time: "2:00 PM",
      date: "Yesterday",
      type: "chores",
      for: "Both",
      status: "completed",
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "health":
        return "bg-green-100 border-green-300";
      case "romance":
        return "bg-pink-100 border-pink-300";
      case "family":
        return "bg-blue-100 border-blue-300";
      case "daily":
        return "bg-purple-100 border-purple-300";
      case "chores":
        return "bg-orange-100 border-orange-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "health":
        return "💊";
      case "romance":
        return "💕";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "daily":
        return "☕";
      case "chores":
        return "🛒";
      default:
        return "📝";
    }
  };

  const createNewReminder = () => {
    Alert.alert(
      "Create Reminder",
      "This will open the reminder creation form!"
    );
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-pink-50 to-red-50">
      <ScrollView className="flex-1 px-4 pt-12">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Love Reminders 💕
          </Text>
          <Text className="text-gray-600">
            Keep track of all your sweet moments together
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row space-x-3 mb-6">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-pink-200">
            <View className="items-center">
              <Text className="text-2xl mb-1">📅</Text>
              <Text className="text-lg font-bold text-gray-900">3</Text>
              <Text className="text-xs text-gray-600">Active</Text>
            </View>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-green-200">
            <View className="items-center">
              <Text className="text-2xl mb-1">✅</Text>
              <Text className="text-lg font-bold text-gray-900">2</Text>
              <Text className="text-xs text-gray-600">Completed</Text>
            </View>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-purple-200">
            <View className="items-center">
              <Text className="text-2xl mb-1">🎯</Text>
              <Text className="text-lg font-bold text-gray-900">80%</Text>
              <Text className="text-xs text-gray-600">Success</Text>
            </View>
          </View>
        </View>

        {/* Create New Reminder Button */}
        <TouchableOpacity
          onPress={createNewReminder}
          className="bg-gradient-to-r from-pink-500 to-red-500 py-4 px-6 rounded-2xl mb-6 shadow-lg"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="add-circle" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Create New Reminder
            </Text>
          </View>
        </TouchableOpacity>

        {/* Active Reminders */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            🔔 Active Reminders
          </Text>
          {activeReminders.map((reminder) => (
            <View
              key={reminder.id}
              className={`bg-white rounded-2xl p-4 mb-3 border ${getTypeColor(
                reminder.type
              )} shadow-sm`}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-xl mr-2">
                      {getTypeIcon(reminder.type)}
                    </Text>
                    <Text className="font-bold text-gray-900 text-lg">
                      {reminder.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-4">
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={16} color="#6b7280" />
                      <Text className="text-gray-600 ml-1">
                        {reminder.time} • {reminder.date}
                      </Text>
                    </View>
                    <View className="bg-pink-100 px-2 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-pink-600">
                        For {reminder.for}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity className="bg-green-100 p-2 rounded-full">
                    <Ionicons name="checkmark" size={20} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Completed Reminders */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            ✅ Completed Today
          </Text>
          {completedReminders.map((reminder) => (
            <View
              key={reminder.id}
              className="bg-white rounded-2xl p-4 mb-3 border border-green-200 shadow-sm opacity-75"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-xl mr-2">
                      {getTypeIcon(reminder.type)}
                    </Text>
                    <Text className="font-bold text-gray-900 text-lg line-through">
                      {reminder.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-4">
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={16} color="#6b7280" />
                      <Text className="text-gray-600 ml-1">
                        {reminder.time} • {reminder.date}
                      </Text>
                    </View>
                    <View className="bg-green-100 px-2 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-green-600">
                        Completed
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="bg-green-100 p-2 rounded-full">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            ⚡ Quick Actions
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 border border-pink-200 items-center">
              <Text className="text-2xl mb-2">📅</Text>
              <Text className="font-semibold text-gray-900">Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 border border-blue-200 items-center">
              <Text className="text-2xl mb-2">📊</Text>
              <Text className="font-semibold text-gray-900">Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 border border-purple-200 items-center">
              <Text className="text-2xl mb-2">⚙️</Text>
              <Text className="font-semibold text-gray-900">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Love Quote */}
        <View className="bg-gradient-to-r from-pink-300 to-red-300 rounded-2xl p-6 border border-red-200 mb-8">
          <View className="items-center">
            <Text className="text-3xl mb-4">💖</Text>
            <Text className="text-base text-gray-800 text-center italic leading-6 mb-4">
              &apos;The best reminder is the one that comes from the
              heart.&apos;
            </Text>
            <View className="bg-red-200 rounded-xl px-4 py-2">
              <Text className="text-xs font-bold text-red-600">
                💕 Reminder Quote
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
