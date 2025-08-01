import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const { width } = Dimensions.get("window");

export default function CustomAlert({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  showConfirmButton = false,
  confirmText = "OK",
  cancelText = "Cancel",
}: CustomAlertProps) {
  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return {
          icon: "heart",
          color: "#FF6B6B",
          bgColor: "#FFF5F5",
          borderColor: "#FFB3B3",
        };
      case "error":
        return {
          icon: "sad",
          color: "#FF6B6B",
          bgColor: "#FFF5F5",
          borderColor: "#FFB3B3",
        };
      case "warning":
        return {
          icon: "warning",
          color: "#FF8E8E",
          bgColor: "#FFF5F5",
          borderColor: "#FFB3B3",
        };
      default:
        return {
          icon: "information-circle",
          color: "#FF6B6B",
          bgColor: "#FFF5F5",
          borderColor: "#FFB3B3",
        };
    }
  };

  const { icon, color, bgColor, borderColor } = getIconAndColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          // Allow tapping outside to dismiss for info and success alerts
          if (type === "info" || type === "success") {
            onClose();
          }
        }}
      >
        <TouchableOpacity
          style={styles.alertContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()} // Prevent closing when tapping inside
        >
          {/* Decorative hearts background */}
          <View style={styles.heartsBackground}>
            <Ionicons
              name="heart"
              size={16}
              color="#FFE5E5"
              style={styles.heart1}
            />
            <Ionicons
              name="heart"
              size={12}
              color="#FFE5E5"
              style={styles.heart2}
            />
            <Ionicons
              name="heart"
              size={14}
              color="#FFE5E5"
              style={styles.heart3}
            />
          </View>

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: bgColor, borderColor },
            ]}
          >
            <Ionicons name={icon as any} size={28} color={color} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {showConfirmButton && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: color },
                showConfirmButton && { flex: 1, marginLeft: 8 },
              ]}
              onPress={() => {
                if (onConfirm) {
                  onConfirm();
                } else {
                  onClose();
                }
              }}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alertContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 28,
    width: width - 40,
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: "#FFB3B3",
    position: "relative",
  },
  heartsBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    overflow: "hidden",
  },
  heart1: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  heart2: {
    position: "absolute",
    bottom: 30,
    left: 15,
  },
  heart3: {
    position: "absolute",
    top: 40,
    left: 25,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#FFF5F5",
    borderWidth: 2,
    borderColor: "#FFB3B3",
  },
  confirmButton: {
    backgroundColor: "#FF6B6B",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
