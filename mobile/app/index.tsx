import React, { useEffect, useState, useCallback } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/auth";
import {
  useGetProfileLazyQuery,
  useRenewTokenMutation,
} from "../generated/graphql";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setAuth } = useAuthStore();
  const [getProfile] = useGetProfileLazyQuery();
  const [renewToken] = useRenewTokenMutation();

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Try to get profile - this validates the token
      const { data, error } = await getProfile();

      if (data?.getProfile && !error) {
        // Token is valid, renew it and set auth
        const renewResult = await renewToken();
        const newToken = renewResult.data?.renewToken?.token || token;
        await setAuth(newToken, data.getProfile);
        setIsAuthenticated(true);
      } else {
        // Token invalid, clear it
        await SecureStore.deleteItemAsync("jwt_token");
        setIsAuthenticated(false);
      }
    } catch {
      await SecureStore.deleteItemAsync("jwt_token");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [getProfile, renewToken, setAuth]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-pink-50 justify-center items-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-600 mt-4 font-medium">Loading...</Text>
      </SafeAreaView>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/auth" />;
  }
}
