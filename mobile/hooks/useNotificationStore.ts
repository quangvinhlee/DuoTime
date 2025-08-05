import { useEffect } from "react";
import {
  useGetUserNotificationsQuery,
  useOnNotificationReceivedSubscription,
  useGetUnreadNotificationCountQuery,
} from "../generated/graphql";
import { useNotificationStore } from "../store/notification";

export const useNotificationStoreWithGraphQL = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    newNotification,
    setNotifications,
    setUnreadCount,
    setLoading,
    setError,
    addNotification,
    markAsRead,
    deleteNotification,
    clearBadge,
    updateBadge,
  } = useNotificationStore();

  // 🔥 Initial fetch (on mount) - Pull older notifications
  const {
    data: notificationsData,
    loading: notificationsLoading,
    error: notificationsError,
  } = useGetUserNotificationsQuery({
    fetchPolicy: "cache-and-network",
  });

  // 🔥 Initial fetch (on mount) - Pull unread count
  const { data: countData } = useGetUnreadNotificationCountQuery({
    fetchPolicy: "cache-and-network",
  });

  // 👂 Real-time push - Subscription for new notifications
  const { data: subscriptionData } = useOnNotificationReceivedSubscription({
    onError: (error) => {
      console.log("🔔 Notification Store Subscription Error:", error);
    },
    onData: (data) => {
      console.log("🔔 Notification Store Data Received:", data);
    },
  });

  // 📥 Initial load - Sync notifications from GraphQL to Zustand
  useEffect(() => {
    if (notificationsData?.getUserNotifications) {
      setNotifications(notificationsData.getUserNotifications);
    }
  }, [notificationsData, setNotifications]);

  // 📥 Initial load - Sync unread count from GraphQL to Zustand
  useEffect(() => {
    if (countData?.getUnreadNotificationCount !== undefined) {
      setUnreadCount(countData.getUnreadNotificationCount);
    }
  }, [countData, setUnreadCount]);

  // ⚡ Real-time push - Add new notifications to state immediately
  useEffect(() => {
    if (subscriptionData?.notificationReceived) {
      console.log(
        "🎉 New notification received in store!",
        subscriptionData.notificationReceived
      );
      // Add to state immediately - no refetch needed!
      addNotification(subscriptionData.notificationReceived);
    }
  }, [subscriptionData, addNotification]);

  // Sync loading and error states
  useEffect(() => {
    setLoading(notificationsLoading);
  }, [notificationsLoading, setLoading]);

  useEffect(() => {
    setError(notificationsError);
  }, [notificationsError, setError]);

  return {
    // State from Zustand
    notifications,
    unreadCount,
    loading,
    error,
    newNotification,

    // Actions from Zustand
    markAsRead,
    deleteNotification,
    clearBadge,
    updateBadge,
  };
};
