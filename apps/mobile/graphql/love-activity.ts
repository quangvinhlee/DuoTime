import { gql } from "@apollo/client";

export const CREATE_LOVE_ACTIVITY = gql`
  mutation CreateLoveActivity($input: CreateLoveActivityInput!) {
    createLoveActivity(input: $input) {
      id
      title
      description
      type
      date
      location
      createdById
      receiverId
      confirmedById
      status
      createdAt
      updatedAt
      confirmedAt
      createdBy {
        id
        name
        avatarUrl
      }
      confirmedBy {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const GET_LOVE_ACTIVITIES = gql`
  query GetLoveActivities($input: GetLoveActivitiesInput!) {
    getLoveActivities(input: $input) {
      id
      title
      description
      type
      date
      location
      createdById
      receiverId
      confirmedById
      status
      createdAt
      updatedAt
      confirmedAt
      createdBy {
        id
        name
        avatarUrl
      }
      confirmedBy {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const GET_LOVE_ACTIVITY = gql`
  query GetLoveActivity($activityId: String!) {
    getLoveActivity(activityId: $activityId) {
      id
      title
      description
      type
      date
      location
      createdById
      receiverId
      confirmedById
      status
      createdAt
      updatedAt
      confirmedAt
      createdBy {
        id
        name
        avatarUrl
      }
      confirmedBy {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const UPDATE_LOVE_ACTIVITY = gql`
  mutation UpdateLoveActivity(
    $activityId: String!
    $input: UpdateLoveActivityInput!
  ) {
    updateLoveActivity(activityId: $activityId, input: $input) {
      success
      message
    }
  }
`;

export const DELETE_LOVE_ACTIVITY = gql`
  mutation DeleteLoveActivity($activityId: String!) {
    deleteLoveActivity(activityId: $activityId) {
      success
      message
    }
  }
`;

export const CONFIRM_LOVE_ACTIVITY = gql`
  mutation ConfirmLoveActivity($input: ConfirmLoveActivityInput!) {
    confirmLoveActivity(input: $input) {
      success
      message
    }
  }
`;

export const GET_LOVE_ACTIVITY_STATS = gql`
  query GetLoveActivityStats {
    getLoveActivityStats {
      totalActivities
      thisMonthActivities
      currentStreak
      longestStreak
      mostCommonActivity
      lastActivityDate
    }
  }
`;
