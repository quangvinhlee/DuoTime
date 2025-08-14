# Reminder Notifications

This document describes the reminder notification system implemented in the DuoTime mobile app.

## Overview

The reminder notification system provides a call-like notification experience for reminders, featuring:

- **Top banner display**: Notifications appear at the top of the screen like incoming calls
- **Persistent alerts**: Notifications ring and vibrate until user interaction
- **Action buttons**: Users can dismiss, snooze, or complete reminders
- **Visual feedback**: Pulsing animation and haptic feedback

## Components

### 1. ReminderNotificationBanner

- **Location**: `mobile/components/ReminderNotificationBanner.tsx`
- **Purpose**: Displays the actual notification banner with animations and interactions
- **Features**:
  - Slide-in animation from top
  - Pulsing effect to draw attention
  - Vibration pattern (500ms on, 200ms off, repeat every 1.5s)
  - Action buttons (snooze, complete, dismiss)
  - Haptic feedback on interaction

### 2. ReminderNotificationManager

- **Location**: `mobile/components/ReminderNotificationManager.tsx`
- **Purpose**: Manages the state of active reminder notifications
- **Features**:
  - Filters reminder notifications from the notification store
  - Handles snooze functionality (5-minute delay)
  - Manages completion and dismissal actions

### 3. Updated NotificationListener

- **Location**: `mobile/components/NotificationListener.tsx`
- **Purpose**: Intercepts incoming notifications and routes reminder notifications to the banner system
- **Features**:
  - Detects reminder notification type
  - Adds reminders to notification store for banner display
  - Prevents duplicate toast notifications for reminders

## How It Works

1. **Backend sends reminder notification** via the reminder processor
2. **Push notification service** sends high-priority notification with reminder-specific data
3. **Mobile app receives notification** through Expo Notifications
4. **NotificationListener** intercepts and routes to banner system
5. **ReminderNotificationManager** displays banner with persistent alert
6. **User interacts** with banner (dismiss/snooze/complete)
7. **Banner disappears** and stops all alerts

## Configuration

### Backend Configuration

- Reminder notifications are sent with `priority: 'high'`
- System sound: `'default'` (uses device's default notification sound)
- Channel ID: `'reminders'` for Android
- Category ID: `'reminder'` for iOS

### Mobile Configuration

- Banner appears at top of screen with 50px padding for status bar
- Vibration pattern: `[0, 500, 200, 500]` repeated every 1.5s
- Snooze duration: 5 minutes
- Z-index: 1000 to ensure banner appears above all content

## Customization

### Using System Sounds

The reminder notifications use the device's default notification sound:

- **iOS**: Uses the system notification sound set in Settings
- **Android**: Uses the default notification sound
- **No custom files needed**: The system handles the sound automatically

To change the sound:

1. **iOS**: Go to Settings > Sounds & Haptics > Default Alerts
2. **Android**: Go to Settings > Sound > Default notification sound

### Changing Vibration Pattern

Modify the `vibratePattern` array in `startVibration()` function:

```typescript
const vibratePattern = [0, 500, 200, 500]; // [delay, vibrate, pause, vibrate]
```

### Adjusting Snooze Duration

Change the timeout in `handleSnooze()` function:

```typescript
setTimeout(() => {
  // Re-add reminder logic
}, 5 * 60 * 1000); // 5 minutes in milliseconds
```

## Dependencies

- `expo-av`: For audio playback (optional)
- `expo-haptics`: For haptic feedback
- `react-native`: For vibration and animations
- `@expo/vector-icons`: For action button icons

## Testing

To test the reminder notification system:

1. Create a reminder in the app
2. Set the reminder time to a few minutes in the future
3. Wait for the notification to trigger
4. Verify the banner appears with animations and vibration
5. Test all action buttons (dismiss, snooze, complete)

## Troubleshooting

### Banner not appearing

- Check that `ReminderNotificationManager` is included in `_layout.tsx`
- Verify notification type is 'REMINDER' in backend
- Check console logs for notification reception

### No vibration/sound

- Ensure device is not in silent mode
- Check vibration permissions
- Verify haptics are enabled on device

### Multiple banners

- Check for duplicate notifications in store
- Verify notification deduplication logic
