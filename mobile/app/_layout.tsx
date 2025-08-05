import { Stack } from "expo-router";
import "../global.css";
import { ApolloWrapper } from "../apollo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { NotificationProvider } from "../contexts/NotificationContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Toast />
      <ApolloWrapper>
        <NotificationProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </NotificationProvider>
      </ApolloWrapper>
    </SafeAreaProvider>
  );
}
