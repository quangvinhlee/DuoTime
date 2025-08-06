import { Stack } from "expo-router";
import "../global.css";
import { ApolloWrapper } from "../apollo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { configurePushNotifications } from "../utils/pushToken";
import { NotificationListener } from "../components/NotificationListener";

export default function RootLayout() {
  // Configure push notifications
  configurePushNotifications();

  return (
    <SafeAreaProvider>
      <Toast />
      <ApolloWrapper>
        <NotificationListener />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ApolloWrapper>
    </SafeAreaProvider>
  );
}
