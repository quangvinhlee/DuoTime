import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ReminderNotificationBanner from "./ReminderNotificationBanner";
import { useNotificationStore } from "../store/notification";

interface ReminderNotification {
  id: string;
  reminderId: string;
  title: string;
  message: string;
  timestamp: number;
}

export default function ReminderNotificationManager() {
  const [activeReminders, setActiveReminders] = useState<
    ReminderNotification[]
  >([]);
  const { newNotification } = useNotificationStore();

  useEffect(() => {
    // Only handle new reminder notifications (not persisted)
    if (newNotification && newNotification.type === "REMINDER") {
      const reminder: ReminderNotification = {
        id: newNotification.id,
        reminderId: newNotification.reminderId || "",
        title: newNotification.title,
        message: newNotification.message,
        timestamp: Date.now(),
      };

      setActiveReminders((prev) => [...prev, reminder]);
    }
  }, [newNotification]);

  const handleDismiss = (reminderId: string) => {
    // Remove from active reminders only (no persistence)
    setActiveReminders((prev) =>
      prev.filter((reminder) => reminder.reminderId !== reminderId)
    );
  };

  const handleSnooze = (reminderId: string) => {
    // Snooze for 5 minutes
    setTimeout(() => {
      // Re-add the reminder after snooze period
      const reminder = activeReminders.find((r) => r.reminderId === reminderId);
      if (reminder) {
        setActiveReminders((prev) => [
          ...prev.filter((r) => r.reminderId !== reminderId),
          { ...reminder, timestamp: Date.now() },
        ]);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Remove from current active reminders
    setActiveReminders((prev) =>
      prev.filter((reminder) => reminder.reminderId !== reminderId)
    );
  };

  const handleComplete = (reminderId: string) => {
    // Mark reminder as completed
    // You can add API call here to mark reminder as completed
    console.log("Reminder completed:", reminderId);

    // Remove from active reminders only (no persistence)
    setActiveReminders((prev) =>
      prev.filter((reminder) => reminder.reminderId !== reminderId)
    );
  };

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000 }}
    >
      {activeReminders.map((reminder, index) => (
        <ReminderNotificationBanner
          key={reminder.id}
          visible={true}
          title={reminder.title}
          message={reminder.message}
          reminderId={reminder.reminderId}
          onDismiss={() => handleDismiss(reminder.reminderId)}
          onSnooze={() => handleSnooze(reminder.reminderId)}
          onComplete={() => handleComplete(reminder.reminderId)}
        />
      ))}
    </View>
  );
}
