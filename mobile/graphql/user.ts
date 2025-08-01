import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      name
      avatarUrl
      partnerId
      partner {
        id
        name
        avatarUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      avatarUrl
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($input: UploadAvatarInput!) {
    uploadAvatar(input: $input) {
      id
      avatarUrl
    }
  }
`;

export const DELETE_AVATAR = gql`
  mutation DeleteAvatar {
    deleteAvatar {
      success
      message
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
      id
      name
      avatarUrl
    }
  }
`;
