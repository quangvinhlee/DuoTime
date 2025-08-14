import { gql } from "@apollo/client";

// Query to get all user notifications with pagination
export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications($limit: Int, $offset: Int) {
    getUserNotifications(limit: $limit, offset: $offset) {
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

// Query to get unread notification count
export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount {
    getUnreadNotificationCount
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

// Mutation to mark all notifications as read
export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
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

// Subscription for real-time notifications (user-specific)
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
