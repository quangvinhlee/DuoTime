import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface NotificationBadgeProps {
  count: number;
  size?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 16,
}) => {
  if (count === 0) return null;

  return (
    <View style={[styles.badge, { width: size, height: size }]}>
      <Text style={[styles.text, { fontSize: size * 0.6 }]}>
        {count > 99 ? "99+" : count.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 16,
    minHeight: 16,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
