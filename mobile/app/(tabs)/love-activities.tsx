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
  ScrollView,
} from "react-native";
import {
  useGetLoveActivitiesQuery,
  useCreateLoveActivityMutation,
  useConfirmLoveActivityMutation,
  useGetProfileQuery,
  useOnNotificationReceivedSubscription,
  ActivityType,
  ActivityStatus,
} from "../../generated/graphql";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface LoveActivity {
  id: string;
  title: string;
  description?: string | null;
  type: ActivityType;
  date: string;
  location?: string | null;
  createdById: string;
  receiverId: string;
  confirmedById?: string | null;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string | null;
  createdBy?: {
    id: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
  confirmedBy?: {
    id: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export default function LoveActivitiesScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState<ActivityType>(
    ActivityType.Dinner
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: profileData } = useGetProfileQuery();

  const { data, loading, error, refetch } = useGetLoveActivitiesQuery({
    variables: { input: { limit: 50, offset: 0 } },
  });

  // Real-time subscription for notifications
  const { data: subscriptionData } = useOnNotificationReceivedSubscription({
    onError: (error) => {
      console.log("🔔 Love Activities Subscription Error:", error);
    },
  });

  // Handle real-time notifications
  useEffect(() => {
    if (subscriptionData?.notificationReceived?.type === "PARTNER_ACTIVITY") {
      refetch();
      Toast.show({
        type: "info",
        text1: "New Love Activity! 💕",
        text2: "Your partner logged a new activity. Check it out!",
      });
    }
  }, [subscriptionData, refetch]);

  const [createLoveActivity] = useCreateLoveActivityMutation({
    onCompleted: (data) => {
      Toast.show({
        type: "success",
        text1: "Activity Created! 💕",
        text2: "Your partner will be notified to confirm this activity.",
      });
      setIsCreateModalVisible(false);
      setTitle("");
      setDescription("");
      setLocation("");
      setSelectedType(ActivityType.Dinner);
      setSelectedDate(new Date());
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

  const [confirmActivity] = useConfirmLoveActivityMutation({
    onCompleted: (data) => {
      Toast.show({
        type: "success",
        text1: "Activity Confirmed! 💕",
        text2: data.confirmLoveActivity.message,
      });
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

  const handleCreateLoveActivity = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!profileData?.getProfile?.partnerId) {
      Alert.alert(
        "Error",
        "You need to be connected with a partner to create love activities"
      );
      return;
    }

    createLoveActivity({
      variables: {
        input: {
          title: title.trim(),
          description: description.trim() || undefined,
          type: selectedType,
          date: selectedDate.toISOString(),
          location: location.trim() || undefined,
          receiverId: profileData.getProfile.partnerId,
        },
      },
    });
  };

  const handleConfirmActivity = (activityId: string, confirm: boolean) => {
    confirmActivity({
      variables: {
        input: {
          activityId,
          confirm,
        },
      },
    });
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.Dinner:
        return "🍽️";
      case ActivityType.Movie:
        return "🎬";
      case ActivityType.Walk:
        return "🚶";
      case ActivityType.Travel:
        return "✈️";
      case ActivityType.Gift:
        return "🎁";
      case ActivityType.Surprise:
        return "🎉";
      case ActivityType.Anniversary:
        return "💕";
      case ActivityType.Birthday:
        return "🎂";
      case ActivityType.Date:
        return "💑";
      case ActivityType.Casual:
        return "😊";
      default:
        return "💕";
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.Confirmed:
        return "#4CAF50";
      case ActivityStatus.Pending:
        return "#FF9800";
      case ActivityStatus.Rejected:
        return "#F44336";
      default:
        return "#999";
    }
  };

  const getStatusText = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.Confirmed:
        return "Confirmed";
      case ActivityStatus.Pending:
        return "Pending";
      case ActivityStatus.Rejected:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const renderLoveActivity = ({ item }: { item: LoveActivity }) => {
    const isMyActivity = item.createdById === profileData?.getProfile?.id;
    const isPending = item.status === ActivityStatus.Pending;
    const canConfirm = !isMyActivity && isPending;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.activityInfo}>
            <Text style={styles.activityIcon}>
              {getActivityIcon(item.type)}
            </Text>
            <View style={styles.activityDetails}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
        </View>

        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}

        {item.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}

        <View style={styles.creatorInfo}>
          <Text style={styles.creatorText}>
            Created by: {item.createdBy?.name || "Your Partner"}
          </Text>
        </View>

        {canConfirm && (
          <View style={styles.confirmButtons}>
            <TouchableOpacity
              style={[styles.confirmButton, styles.acceptButton]}
              onPress={() => handleConfirmActivity(item.id, true)}
            >
              <Text style={styles.confirmButtonText}>Accept ✅</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, styles.rejectButton]}
              onPress={() => handleConfirmActivity(item.id, false)}
            >
              <Text style={styles.confirmButtonText}>Reject ❌</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.confirmedBy && (
          <View style={styles.confirmedBy}>
            <Text style={styles.confirmedByText}>
              Confirmed by: {item.confirmedBy.name || "Your Partner"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading love activities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading activities: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Love Activities 💕</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data?.getLoveActivities || []}
        renderItem={renderLoveActivity}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Love Activity</Text>
              <TouchableOpacity
                onPress={() => setIsCreateModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="What did you do together?"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell us more about this activity..."
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Type</Text>
              <View style={styles.typeContainer}>
                {Object.values(ActivityType).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      selectedType === type && styles.selectedTypeButton,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedType === type && styles.selectedTypeButtonText,
                      ]}
                    >
                      {getActivityIcon(type)} {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Where did this happen?"
              />

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleCreateLoveActivity}
              >
                <Text style={styles.sendButtonText}>Send to Partner 💕</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#FF6B9D",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  activityInfo: {
    flexDirection: "row",
    flex: 1,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  creatorInfo: {
    marginBottom: 8,
  },
  creatorText: {
    fontSize: 12,
    color: "#999",
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  confirmedBy: {
    marginTop: 8,
  },
  confirmedByText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "bold",
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
    color: "red",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  selectedTypeButton: {
    backgroundColor: "#FF6B9D",
    borderColor: "#FF6B9D",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedTypeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  sendButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
