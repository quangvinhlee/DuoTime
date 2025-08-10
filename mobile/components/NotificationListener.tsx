import React, { useEffect } from "react";
import {
  addNotificationListener,
  addNotificationResponseListener,
} from "../utils/pushToken";
import Toast from "react-native-toast-message";
import { useNotificationStore } from "../store/notification";

export const NotificationListener: React.FC = () => {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    // Listen for incoming notifications
    const notificationListener = addNotificationListener((notification) => {
      console.log("Notification received:", notification);

      const data = notification.request.content.data as any;
      const notificationType = data?.type || "GENERAL";

      // Handle reminder notifications differently
      if (notificationType === "REMINDER") {
        // Add to notification store for reminder banner
        addNotification({
          id: (data?.notificationId as string) || Date.now().toString(),
          type: "REMINDER",
          title: notification.request.content.title || "Reminder",
          message: notification.request.content.body || "You have a reminder",
          reminderId: (data?.reminderId as string) || null,
          sentAt: new Date(),
          isRead: false,
          userId: "", // This will be set by the backend
        });

        // Don't show toast for reminders as they'll be handled by the banner
        return;
      }

      // Show toast for other notifications
      Toast.show({
        type: "success",
        text1: notification.request.content.title || "New Notification",
        text2: notification.request.content.body || "You have a new message",
        position: "top",
      });
    });

    // Listen for notification responses (when user taps notification)
    const responseListener = addNotificationResponseListener((response) => {
      console.log("Notification response:", response);

      // Handle navigation based on notification data
      const data = response.notification.request.content.data;
      if (data?.type === "PARTNER_ACTIVITY") {
        // Navigate to partner screen
        // You can add navigation logic here
        console.log("Navigate to partner screen");
      } else if (data?.type === "REMINDER") {
        // Handle reminder notification tap
        console.log("Reminder notification tapped:", data?.reminderId);
        // You can add navigation to reminders screen here
      }
    });

    // Cleanup listeners
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [addNotification]);

  return null; // This component doesn't render anything
};
