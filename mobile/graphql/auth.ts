import { gql } from "@apollo/client";

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($googleLoginInput: GoogleLoginInput!) {
    googleLogin(googleLoginInput: $googleLoginInput) {
      token
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      email
      googleId
      name
      avatarUrl
      partnerId
      createdAt
      updatedAt
    }
  }
`;
