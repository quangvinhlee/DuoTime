import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNotificationStore } from "../store/notification";

export default function ClearNotificationsButton() {
  const { notifications, deleteNotification } = useNotificationStore();

  const clearAllNotifications = () => {
    notifications.forEach((notification) => {
      deleteNotification(notification.id);
    });
    console.log("All notifications cleared");
  };

  const clearOldReminders = () => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    notifications.forEach((notification) => {
      if (notification.type === "REMINDER") {
        const notificationTime = new Date(notification.sentAt).getTime();
        if (notificationTime < oneHourAgo) {
          deleteNotification(notification.id);
        }
      }
    });
    console.log("Old reminder notifications cleared");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={clearAllNotifications}>
        <Text style={styles.buttonText}>Clear All Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={clearOldReminders}
      >
        <Text style={styles.buttonText}>Clear Old Reminders</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Active notifications: {notifications.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  button: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#FF8E8E",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});
