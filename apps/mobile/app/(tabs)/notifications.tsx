import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import {
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from "../../generated/graphql";
import { useNotificationStoreWithGraphQL } from "../../hooks/useNotificationStore";
import { Ionicons } from "@expo/vector-icons";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
  reminderId?: string | null;
  userId: string;
}

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // GraphQL hooks
  const { notifications, loading, error, refetch, updateBadge } =
    useNotificationStoreWithGraphQL();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({
        variables: { notificationId },
      });
      // Refetch to update the UI
      refetch();
      // Update badge count - decrease by 1 since we marked one as read
      const currentUnreadCount = notifications.filter((n) => !n.isRead).length;
      updateBadge(Math.max(0, currentUnreadCount - 1));
    } catch (error) {
      Alert.alert("Error", "Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNotification({
                variables: { notificationId },
              });
              // Refetch to update the UI
              refetch();
              // Update badge count - decrease by 1 if the deleted notification was unread
              const deletedNotification = notifications.find(
                (n) => n.id === notificationId
              );
              if (deletedNotification && !deletedNotification.isRead) {
                const currentUnreadCount = notifications.filter(
                  (n) => !n.isRead
                ).length;
                updateBadge(Math.max(0, currentUnreadCount - 1));
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete notification");
            }
          },
        },
      ]
    );
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <View style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.sentAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.message}>{item.message}</Text>

        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {!item.isRead && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>No notifications yet</Text>
      <Text style={styles.emptyStateSubtext}>
        You'll see notifications here when you receive them
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load notifications</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshControl={
          <RefreshControl
            key="notification-refresh"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    backgroundColor: "#f8f9ff",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  typeContainer: {
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
});
