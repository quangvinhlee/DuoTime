import { gql } from "@apollo/client";

export const CREATE_LOVE_NOTE = gql`
  mutation CreateLoveNote($input: CreateLoveNoteInput!) {
    createLoveNote(input: $input) {
      id
      title
      message
      isRead
      senderId
      recipientId
      createdAt
      updatedAt
      sender {
        id
        name
        avatarUrl
      }
      recipient {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const GET_LOVE_NOTES = gql`
  query GetLoveNotes($input: GetLoveNotesInput!) {
    getLoveNotes(input: $input) {
      id
      title
      message
      isRead
      senderId
      recipientId
      createdAt
      updatedAt
      sender {
        id
        name
        avatarUrl
      }
      recipient {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const GET_LOVE_NOTE = gql`
  query GetLoveNote($loveNoteId: String!) {
    getLoveNote(loveNoteId: $loveNoteId) {
      id
      title
      message
      isRead
      senderId
      recipientId
      createdAt
      updatedAt
      sender {
        id
        name
        avatarUrl
      }
      recipient {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const UPDATE_LOVE_NOTE = gql`
  mutation UpdateLoveNote($loveNoteId: String!, $input: UpdateLoveNoteInput!) {
    updateLoveNote(loveNoteId: $loveNoteId, input: $input) {
      id
      title
      message
      isRead
      senderId
      recipientId
      createdAt
      updatedAt
      sender {
        id
        name
        avatarUrl
      }
      recipient {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const DELETE_LOVE_NOTE = gql`
  mutation DeleteLoveNote($loveNoteId: String!) {
    deleteLoveNote(loveNoteId: $loveNoteId) {
      success
      message
    }
  }
`;

export const MARK_LOVE_NOTE_AS_READ = gql`
  mutation MarkLoveNoteAsRead($loveNoteId: String!) {
    markLoveNoteAsRead(loveNoteId: $loveNoteId) {
      id
      title
      message
      isRead
      senderId
      recipientId
      createdAt
      updatedAt
      sender {
        id
        name
        avatarUrl
      }
      recipient {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const GET_UNREAD_LOVE_NOTE_COUNT = gql`
  query GetUnreadLoveNoteCount {
    getUnreadLoveNoteCount
  }
`;
