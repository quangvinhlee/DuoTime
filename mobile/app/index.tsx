import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/auth";
import { useGetProfileLazyQuery } from "../generated/graphql";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setAuth } = useAuthStore();
  const [getProfile] = useGetProfileLazyQuery();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 1. Check if token exists in SecureStore
      const token = await SecureStore.getItemAsync("jwt_token");
      console.log("🔍 Token found:", token ? "YES" : "NO");

      if (!token) {
        // No token found, user needs to login
        console.log("❌ No token found, redirecting to auth");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // 2. Validate token by fetching user profile
      console.log("🔄 Validating token...");
      const { data, error } = await getProfile();
      console.log("📊 Profile data:", data?.getProfile ? "SUCCESS" : "FAILED");
      console.log("❌ Profile error:", error);

      if (data?.getProfile && !error) {
        // Token is valid, restore user session
        console.log("✅ Token valid, restoring session");
        await setAuth(token, data.getProfile);
        setIsAuthenticated(true);
      } else {
        // Token is invalid/expired, remove it
        console.log("💥 Token invalid/expired, removing...");
        await SecureStore.deleteItemAsync("jwt_token");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("🚨 Auth check failed:", error);
      // On error, assume not authenticated
      await SecureStore.deleteItemAsync("jwt_token");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 bg-pink-50 justify-center items-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-600 mt-4 font-medium">
          💕 Checking your love status...
        </Text>
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/auth" />;
  }
}
