import { useEffect, useRef } from "react";
import {
  useGetUserNotificationsQuery,
  useOnNotificationReceivedSubscription,
} from "../generated/graphql";

export const useRealtimeNotifications = () => {
  const { data, loading, error, refetch } = useGetUserNotificationsQuery();

  // Subscribe to real-time notifications
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useOnNotificationReceivedSubscription({
    onError: (error) => {
      console.log("🔔 Subscription Error:", error);
    },
    onData: (data) => {
      console.log("🔔 Subscription Data Received:", data);
    },
  });

  // Debug logging
  useEffect(() => {
    console.log("🔔 Subscription Data:", subscriptionData);
    console.log("🔔 Subscription Loading:", subscriptionLoading);
    console.log("🔔 Subscription Error:", subscriptionError);
  }, [subscriptionData, subscriptionLoading, subscriptionError]);

  // Refetch when we receive a new notification via subscription
  useEffect(() => {
    if (subscriptionData?.notificationReceived) {
      console.log(
        "🎉 New notification received via subscription!",
        subscriptionData.notificationReceived
      );
      refetch();
    }
  }, [subscriptionData, refetch]);

  return {
    notifications: data?.getUserNotifications || [],
    loading,
    error,
    refetch,
    newNotification: subscriptionData?.notificationReceived,
    subscriptionLoading,
    subscriptionError,
  };
};
