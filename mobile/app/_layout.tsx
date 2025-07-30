import { Stack } from "expo-router";
import "../global.css";
import { ApolloWrapper } from "../apollo";

export default function RootLayout() {
  return (
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
  );
}
