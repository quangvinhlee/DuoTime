import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  useGetUserNotificationsQuery,
  useOnNotificationReceivedSubscription,
  useGetUnreadNotificationCountQuery,
} from "../generated/graphql";

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  loading: boolean;
  error: any;
  refetch: () => void;
  clearBadge: () => void;
  updateBadge: (count: number) => void;
  newNotification: any;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Get notifications
  const { data, loading, error, refetch } = useGetUserNotificationsQuery({
    fetchPolicy: "cache-and-network",
  });

  // Get unread count
  const { data: countData, refetch: refetchCount } =
    useGetUnreadNotificationCountQuery({
      fetchPolicy: "cache-and-network",
    });

  // Subscribe to real-time notifications
  const { data: subscriptionData } = useOnNotificationReceivedSubscription({
    onError: (error) => {
      console.log("🔔 Notification Context Subscription Error:", error);
    },
    onData: (data) => {
      console.log("🔔 Notification Context Data Received:", data);
    },
  });

  // Update unread count when count data changes
  useEffect(() => {
    if (countData?.getUnreadNotificationCount !== undefined) {
      setUnreadCount(countData.getUnreadNotificationCount);
    }
  }, [countData]);

  // Handle new notifications
  useEffect(() => {
    if (subscriptionData?.notificationReceived) {
      console.log(
        "🎉 New notification received in context!",
        subscriptionData.notificationReceived
      );
      refetch();
      refetchCount();
      // Increment badge count immediately for better UX
      setUnreadCount((prev) => prev + 1);
    }
  }, [subscriptionData, refetch, refetchCount]);

  const clearBadge = () => {
    setUnreadCount(0);
  };

  const updateBadge = (count: number) => {
    setUnreadCount(count);
  };

  const value: NotificationContextType = {
    notifications: data?.getUserNotifications || [],
    unreadCount,
    loading,
    error,
    refetch,
    clearBadge,
    updateBadge,
    newNotification: subscriptionData?.notificationReceived,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
