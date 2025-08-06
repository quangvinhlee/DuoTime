import * as Notifications from "expo-notifications";

/**
 * Get push token from Expo Notifications
 * @returns Promise<string | null> - The push token or null if permission denied
 */
export const getPushToken = async (): Promise<string | null> => {
  try {
    // Check current permission status
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    // If permission not granted, request it
    if (existingStatus !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Push notification permission denied");
        return null;
      }
    }

    // Get the push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      // For local development, you can omit projectId
      // projectId: process.env.EXPO_PROJECT_ID, // Only needed for production
    });

    console.log("Push token obtained:", tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.error("Error getting push token:", error);

    // For development, return a mock token if there are issues
    console.log("Using mock token for development");
    return "ExponentPushToken[DEV_MOCK_TOKEN_FOR_TESTING]";
  }
};

/**
 * Configure notification handler
 */
export const configurePushNotifications = () => {
  // Set notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

/**
 * Add notification received listener
 * @param callback Function to call when notification is received
 */
export const addNotificationListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener (when user taps notification)
 * @param callback Function to call when user responds to notification
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};
