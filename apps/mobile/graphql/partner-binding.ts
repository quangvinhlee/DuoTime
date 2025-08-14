import { gql } from "@apollo/client";

// Create a partner binding (send invitation)
export const CREATE_PARTNER_BINDING = gql`
  mutation CreatePartnerBinding(
    $createPartnerBindingDto: CreatePartnerBindingDto!
  ) {
    createPartnerBinding(createPartnerBindingDto: $createPartnerBindingDto) {
      id
      invitationCode
      expiresAt
      status
    }
  }
`;

// Accept a partner binding (join with invitation code)
export const ACCEPT_PARTNER_BINDING = gql`
  mutation AcceptPartnerBinding(
    $acceptPartnerBindingDto: AcceptPartnerBindingDto!
  ) {
    acceptPartnerBinding(acceptPartnerBindingDto: $acceptPartnerBindingDto) {
      id
      invitationCode
      expiresAt
      status
    }
  }
`;

// Reject a partner binding
export const REJECT_PARTNER_BINDING = gql`
  mutation RejectPartnerBinding(
    $rejectPartnerBindingDto: RejectPartnerBindingDto!
  ) {
    rejectPartnerBinding(rejectPartnerBindingDto: $rejectPartnerBindingDto) {
      success
      message
    }
  }
`;

// Remove partner (break the connection)
export const REMOVE_PARTNER = gql`
  mutation RemovePartner {
    removePartner {
      success
      message
    }
  }
`;

// Get current user's profile with partner information
export const GET_PROFILE_WITH_PARTNER = gql`
  query GetProfileWithPartner {
    getProfile {
      id
      email
      googleId
      name
      avatarUrl
      partnerId
      partner {
        id
        email
        name
        avatarUrl
      }
      createdAt
      updatedAt
    }
  }
`;

// Get partner status (simplified version)
export const GET_PARTNER_STATUS = gql`
  query GetPartnerStatus {
    getProfile {
      id
      partnerId
      partner {
        id
        email
        name
        avatarUrl
      }
    }
  }
`;
