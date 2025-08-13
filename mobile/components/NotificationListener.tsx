import React, { useEffect } from "react";
import {
  addNotificationListener,
  addNotificationResponseListener,
} from "../utils/pushToken";
import Toast from "react-native-toast-message";
import { useNotificationStore } from "../store/notification";
import { NotificationType } from "../generated/graphql";

export const NotificationListener: React.FC = () => {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const notificationListener = addNotificationListener((notification) => {
      const data = notification.request.content.data as any;
      const notificationType = data?.type || "GENERAL";

      if (notificationType === "REMINDER") {
        addNotification({
          id: (data?.notificationId as string) || Date.now().toString(),
          type: NotificationType.Reminder,
          title: notification.request.content.title || "Reminder",
          message: notification.request.content.body || "You have a reminder",
          reminderId: (data?.reminderId as string) || null,
          sentAt: new Date(),
          isRead: false,
          userId: "",
        });
        return;
      }

      if (notificationType === "LOVE_NOTE") {
        addNotification({
          id: (data?.notificationId as string) || Date.now().toString(),
          type: NotificationType.LoveNote,
          title: notification.request.content.title || "Love Note",
          message:
            notification.request.content.body || "You received a love note",
          loveNoteId: (data?.loveNoteId as string) || null,
          reminderId: null,
          sentAt: new Date(),
          isRead: false,
          userId: "",
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: notification.request.content.title || "New Notification",
        text2: notification.request.content.body || "You have a new message",
        position: "top",
      });
    });

    const responseListener = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === "PARTNER_ACTIVITY") {
        // Navigate to partner screen
      } else if (data?.type === "REMINDER") {
        // Handle reminder notification tap
      } else if (data?.type === "LOVE_NOTE") {
        // Navigate to love notes screen or open the specific love note
        // You can add navigation logic here
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [addNotification]);

  return null;
};
