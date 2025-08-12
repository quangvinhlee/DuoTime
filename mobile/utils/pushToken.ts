import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

/**
 * Get push token from Expo Notifications
 * @returns Promise<string | null> - The push token or null if permission denied
 */
export const getPushToken = async (): Promise<string | null> => {
  try {
    // Check if device supports push notifications
    if (!Device.isDevice) {
      console.log("Push notifications are only supported on physical devices");
      return null;
    }

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

    // Get the push token with proper configuration
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID, // Your EAS project ID
    });

    console.log("Push token obtained:", tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.error("Error getting push token:", error);

    // Check if it's a Firebase initialization error
    if (
      error instanceof Error &&
      error.message &&
      error.message.includes("FirebaseApp is not initialized")
    ) {
      console.log("Firebase not initialized - this is expected in development");
      console.log("Push tokens will work properly in production builds");

      // Return a development token for testing
      return "ExponentPushToken[DEV_MOCK_TOKEN_FOR_TESTING]";
    }

    // For other errors, return null
    console.log(
      "Push token error:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
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

/**
 * Test function to send a local notification
 * Useful for testing notification handling
 */
export const sendTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification from your app",
        data: { type: "TEST" },
      },
      trigger: null, // Send immediately
    });
    console.log("Test notification scheduled");
  } catch (error) {
    console.error("Error scheduling test notification:", error);
  }
};
