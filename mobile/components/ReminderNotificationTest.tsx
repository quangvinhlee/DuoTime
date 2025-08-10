import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNotificationStore } from "../store/notification";

export default function ReminderNotificationTest() {
  const { addNotification } = useNotificationStore();

  const testReminderNotification = () => {
    addNotification({
      id: `test-reminder-${Date.now()}`,
      type: "REMINDER",
      title: "Test Reminder",
      message: "This is a test reminder notification",
      reminderId: "test-reminder-id",
      sentAt: new Date(),
      isRead: false,
      userId: "test-user",
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={testReminderNotification}
      >
        <Text style={styles.buttonText}>Test Reminder Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
