import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import {
  useGetLoveNotesQuery,
  useCreateLoveNoteMutation,
  useMarkLoveNoteAsReadMutation,
  useGetProfileQuery,
  useOnNotificationReceivedSubscription,
} from "../../generated/graphql";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface LoveNote {
  id: string;
  title?: string | null;
  message: string;
  isRead: boolean;
  senderId: string;
  recipientId: string;
  createdAt: string;
  sender?: {
    id: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
  recipient?: {
    id: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export default function LoveNotesScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Get user profile to get partner ID
  const { data: profileData } = useGetProfileQuery();

  const { data, loading, error, refetch } = useGetLoveNotesQuery({
    variables: {
      input: {
        limit: 50,
        offset: 0,
      },
    },
  });

  // Real-time subscription for love note notifications
  const { data: subscriptionData } = useOnNotificationReceivedSubscription({
    onError: (error) => {
      console.log("🔔 Love Notes Subscription Error:", error);
    },
  });

  // Handle real-time love note notifications
  useEffect(() => {
    if (subscriptionData?.notificationReceived?.type === "LOVE_NOTE") {
      // Refetch love notes when new one is received
      refetch();
      Toast.show({
        type: "success",
        text1: "New Love Note! 💕",
        text2: "You received a new love note from your partner",
      });
    }
  }, [subscriptionData, refetch]);

  const [createLoveNote] = useCreateLoveNoteMutation({
    onCompleted: () => {
      Toast.show({
        type: "success",
        text1: "Love Note Sent! 💕",
        text2: "Your message has been delivered",
      });
      setIsCreateModalVisible(false);
      setTitle("");
      setMessage("");
      refetch();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });

  const [markAsRead] = useMarkLoveNoteAsReadMutation({
    onCompleted: () => {
      refetch();
    },
  });

  const handleCreateLoveNote = () => {
    if (!message.trim()) {
      Toast.show({
        type: "error",
        text1: "Message Required",
        text2: "Please enter a message",
      });
      return;
    }

    if (!profileData?.getProfile?.partnerId) {
      Toast.show({
        type: "error",
        text1: "No Partner",
        text2: "You need to connect with a partner first",
      });
      return;
    }

    createLoveNote({
      variables: {
        input: {
          title: title.trim() || "",
          message: message.trim(),
          recipientId: profileData.getProfile.partnerId,
        },
      },
    });
  };

  const handleMarkAsRead = (loveNoteId: string) => {
    markAsRead({
      variables: {
        loveNoteId,
      },
    });
  };

  const renderLoveNote = ({ item }: { item: LoveNote }) => (
    <TouchableOpacity
      style={[styles.loveNoteCard, !item.isRead && styles.unreadCard]}
      onPress={() => {
        if (!item.isRead) {
          handleMarkAsRead(item.id);
        }
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.senderInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>💕</Text>
          </View>
          <View>
            <Text style={styles.senderName}>
              {item.sender?.name || "Your Partner"}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>

      {item.title && <Text style={styles.title}>{item.title}</Text>}

      <Text style={styles.message}>{item.message}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading love notes... 💕</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading love notes</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const loveNotes = data?.getLoveNotes || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Love Notes 💌</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loveNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No love notes yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Send your first love note to your partner! 💕
          </Text>
        </View>
      ) : (
        <FlatList
          data={loveNotes}
          renderItem={renderLoveNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Love Note Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Write a Love Note 💕</Text>
            <TouchableOpacity
              onPress={() => setIsCreateModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title (optional)"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.messageInput}
              placeholder="Write your love message here..."
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleCreateLoveNote}
            >
              <Text style={styles.sendButtonText}>Send Love Note 💕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE5E5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
  },
  createButton: {
    backgroundColor: "#FF6B6B",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  loveNoteCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  timestamp: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#718096",
    textAlign: "center",
    marginTop: 100,
  },
  errorText: {
    fontSize: 18,
    color: "#E53E3E",
    textAlign: "center",
    marginTop: 100,
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: "#2D3748",
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 200,
    marginBottom: 20,
    color: "#2D3748",
  },
  anonymousToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  anonymousText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#4A5568",
  },
  sendButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
