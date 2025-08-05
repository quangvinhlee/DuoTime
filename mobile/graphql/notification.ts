import { gql } from "@apollo/client";

// Query to get all user notifications
export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications {
    getUserNotifications {
      id
      type
      title
      message
      isRead
      sentAt
      reminderId
      userId
    }
  }
`;

// Mutation to mark a notification as read
export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId) {
      success
      message
    }
  }
`;

// Mutation to delete a notification
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: String!) {
    deleteNotification(notificationId: $notificationId) {
      success
      message
    }
  }
`;

// Subscription for real-time notifications
export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnNotificationReceived {
    notificationReceived {
      id
      type
      title
      message
      isRead
      sentAt
      reminderId
      userId
    }
  }
`;
