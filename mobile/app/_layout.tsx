import { Stack } from "expo-router";
import "../global.css";
import { ApolloWrapper } from "../apollo";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ApolloWrapper>
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
