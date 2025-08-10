import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

interface ReminderNotificationBannerProps {
  visible: boolean;
  title: string;
  message: string;
  reminderId: string;
  onDismiss: () => void;
  onSnooze?: () => void;
  onComplete?: () => void;
}

const { width } = Dimensions.get("window");

export default function ReminderNotificationBanner({
  visible,
  title,
  message,
  reminderId,
  onDismiss,
  onSnooze,
  onComplete,
}: ReminderNotificationBannerProps) {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const vibrationInterval = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      // Start slide-in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Start pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Start vibration pattern
      startVibration();

      // Start sound
      startSound();

      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Stop sound and vibration
      stopSound();
      stopVibration();
    }
  }, [visible]);

  const startVibration = () => {
    // Vibration pattern: vibrate for 500ms, pause for 200ms, repeat
    const vibratePattern = [0, 500, 200, 500];
    vibrationInterval.current = setInterval(() => {
      Vibration.vibrate(vibratePattern);
    }, 1500);
  };

  const stopVibration = () => {
    if (vibrationInterval.current) {
      clearInterval(vibrationInterval.current);
      vibrationInterval.current = null;
    }
    Vibration.cancel();
  };

  const startSound = async () => {
    // System sound is handled by the push notification itself
    // We only need to handle vibration and visual feedback here
    console.log("Reminder notification started (sound handled by system)");
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const handleDismiss = () => {
    stopSound();
    stopVibration();
    onDismiss();
  };

  const handleSnooze = () => {
    stopSound();
    stopVibration();
    onSnooze?.();
  };

  const handleComplete = () => {
    stopSound();
    stopVibration();
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.banner,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {/* Background gradient effect */}
        <View style={styles.gradientBackground} />

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="alarm" size={24} color="#FF6B6B" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          {onSnooze && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSnooze}
            >
              <Ionicons name="time" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          )}

          {onComplete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleComplete}
            >
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={handleDismiss}>
            <Ionicons name="close-circle" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 50, // Account for status bar
  },
  banner: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#FFB3B3",
    position: "relative",
    overflow: "hidden",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFF5F5",
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFB3B3",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
