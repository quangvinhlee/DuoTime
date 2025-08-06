import React, { useEffect } from "react";
import {
  addNotificationListener,
  addNotificationResponseListener,
} from "../utils/pushToken";
import Toast from "react-native-toast-message";

export const NotificationListener: React.FC = () => {
  useEffect(() => {
    // Listen for incoming notifications
    const notificationListener = addNotificationListener((notification) => {
      console.log("Notification received:", notification);

      // Show toast for incoming notification
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
      }
    });

    // Cleanup listeners
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return null; // This component doesn't render anything
};
