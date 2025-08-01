import { gql } from "@apollo/client";

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($googleLoginInput: GoogleLoginInput!) {
    googleLogin(googleLoginInput: $googleLoginInput) {
      token
    }
  }
`;

export const RENEW_TOKEN_MUTATION = gql`
  mutation RenewToken {
    renewToken {
      token
    }
  }
`;
