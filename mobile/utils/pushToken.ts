import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

/**
 * Validate if a string is a valid UUID
 */
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
    // Prioritize the app.json configuration over environment variable to avoid conflicts
    const envProjectId = process.env.EXPO_PUBLIC_PROJECT_ID;
    const configProjectId = Constants.expoConfig?.extra?.eas?.projectId;

    // Use config project ID if it's a valid UUID, otherwise fall back to env
    let projectId = configProjectId;
    if (!projectId || !isValidUUID(projectId)) {
      projectId = envProjectId;
    }

    // Validate that we have a proper UUID
    if (!projectId || !isValidUUID(projectId)) {
      console.error("Invalid project ID format. Expected a valid UUID.");
      console.error("Environment project ID:", envProjectId);
      console.error("Config project ID:", configProjectId);
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });

    return tokenData.data;
  } catch (error) {
    console.error("Error getting push token:", error);

    // Check if it's a Firebase initialization error
    if (
      error instanceof Error &&
      error.message &&
      error.message.includes("FirebaseApp is not initialized")
    ) {
      // Return a development token for testing
      return "ExponentPushToken[DEV_MOCK_TOKEN_FOR_TESTING]";
    }

    // Check if it's a project ID validation error
    if (
      error instanceof Error &&
      error.message &&
      error.message.includes("Invalid uuid")
    ) {
      // Return a development token for testing
      return "ExponentPushToken[DEV_MOCK_TOKEN_FOR_TESTING]";
    }

    // For other errors, return null
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
