import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AcceptPartnerBindingDto = {
  invitationCode: Scalars['String']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String']['output'];
};

export type CreatePartnerBindingDto = {
  receiverId?: InputMaybe<Scalars['String']['input']>;
};

export type GoogleLoginInput = {
  idToken: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptPartnerBinding: PartnerBindingResponse;
  createPartnerBinding: PartnerBindingResponse;
  deleteAvatar: ResponseType;
  deleteNotification: ResponseType;
  googleLogin: AuthResponse;
  markNotificationAsRead: ResponseType;
  rejectPartnerBinding: ResponseType;
  removePartner: ResponseType;
  renewToken: AuthResponse;
  updateProfile: ResponseType;
  uploadAvatar: ResponseType;
};


export type MutationAcceptPartnerBindingArgs = {
  acceptPartnerBindingDto: AcceptPartnerBindingDto;
};


export type MutationCreatePartnerBindingArgs = {
  createPartnerBindingDto: CreatePartnerBindingDto;
};


export type MutationDeleteNotificationArgs = {
  notificationId: Scalars['String']['input'];
};


export type MutationGoogleLoginArgs = {
  googleLoginInput: GoogleLoginInput;
};


export type MutationMarkNotificationAsReadArgs = {
  notificationId: Scalars['String']['input'];
};


export type MutationRejectPartnerBindingArgs = {
  rejectPartnerBindingDto: RejectPartnerBindingDto;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUploadAvatarArgs = {
  input: UploadAvatarInput;
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  reminderId?: Maybe<Scalars['String']['output']>;
  sentAt: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type PartnerBindingResponse = {
  __typename?: 'PartnerBindingResponse';
  expiresAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invitationCode: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getProfile: UserType;
  getUserNotifications: Array<Notification>;
  sayHello: Scalars['String']['output'];
  searchUsers: Array<UserType>;
};


export type QuerySearchUsersArgs = {
  input: SearchUsersInput;
};

export type RejectPartnerBindingDto = {
  invitationCode: Scalars['String']['input'];
};

export type ResponseType = {
  __typename?: 'ResponseType';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SearchUsersInput = {
  excludeUserId?: InputMaybe<Scalars['String']['input']>;
  query: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  notificationReceived: Notification;
};

export type UpdateProfileInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UploadAvatarInput = {
  avatarBase64?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  googleId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  partner?: Maybe<UserType>;
  partnerId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type GoogleLoginMutationVariables = Exact<{
  googleLoginInput: GoogleLoginInput;
}>;


export type GoogleLoginMutation = { __typename?: 'Mutation', googleLogin: { __typename?: 'AuthResponse', token: string } };

export type RenewTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RenewTokenMutation = { __typename?: 'Mutation', renewToken: { __typename?: 'AuthResponse', token: string } };

export type GetUserNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserNotificationsQuery = { __typename?: 'Query', getUserNotifications: Array<{ __typename?: 'Notification', id: string, type: string, title: string, message: string, isRead: boolean, sentAt: any, reminderId?: string | null, userId: string }> };

export type MarkNotificationAsReadMutationVariables = Exact<{
  notificationId: Scalars['String']['input'];
}>;


export type MarkNotificationAsReadMutation = { __typename?: 'Mutation', markNotificationAsRead: { __typename?: 'ResponseType', success: boolean, message: string } };

export type DeleteNotificationMutationVariables = Exact<{
  notificationId: Scalars['String']['input'];
}>;


export type DeleteNotificationMutation = { __typename?: 'Mutation', deleteNotification: { __typename?: 'ResponseType', success: boolean, message: string } };

export type OnNotificationReceivedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNotificationReceivedSubscription = { __typename?: 'Subscription', notificationReceived: { __typename?: 'Notification', id: string, type: string, title: string, message: string, isRead: boolean, sentAt: any, reminderId?: string | null, userId: string } };

export type CreatePartnerBindingMutationVariables = Exact<{
  createPartnerBindingDto: CreatePartnerBindingDto;
}>;


export type CreatePartnerBindingMutation = { __typename?: 'Mutation', createPartnerBinding: { __typename?: 'PartnerBindingResponse', id: string, invitationCode: string, expiresAt: string, status: string } };

export type AcceptPartnerBindingMutationVariables = Exact<{
  acceptPartnerBindingDto: AcceptPartnerBindingDto;
}>;


export type AcceptPartnerBindingMutation = { __typename?: 'Mutation', acceptPartnerBinding: { __typename?: 'PartnerBindingResponse', id: string, invitationCode: string, expiresAt: string, status: string } };

export type RejectPartnerBindingMutationVariables = Exact<{
  rejectPartnerBindingDto: RejectPartnerBindingDto;
}>;


export type RejectPartnerBindingMutation = { __typename?: 'Mutation', rejectPartnerBinding: { __typename?: 'ResponseType', success: boolean, message: string } };

export type RemovePartnerMutationVariables = Exact<{ [key: string]: never; }>;


export type RemovePartnerMutation = { __typename?: 'Mutation', removePartner: { __typename?: 'ResponseType', success: boolean, message: string } };

export type GetProfileWithPartnerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileWithPartnerQuery = { __typename?: 'Query', getProfile: { __typename?: 'UserType', id: string, email: string, googleId: string, name?: string | null, avatarUrl?: string | null, partnerId?: string | null, createdAt: any, updatedAt: any, partner?: { __typename?: 'UserType', id: string, email: string, name?: string | null, avatarUrl?: string | null } | null } };

export type GetPartnerStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPartnerStatusQuery = { __typename?: 'Query', getProfile: { __typename?: 'UserType', id: string, partnerId?: string | null, partner?: { __typename?: 'UserType', id: string, email: string, name?: string | null, avatarUrl?: string | null } | null } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', getProfile: { __typename?: 'UserType', id: string, name?: string | null, avatarUrl?: string | null, partnerId?: string | null, createdAt: any, updatedAt: any, partner?: { __typename?: 'UserType', id: string, name?: string | null, avatarUrl?: string | null } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'ResponseType', success: boolean, message: string } };

export type UploadAvatarMutationVariables = Exact<{
  input: UploadAvatarInput;
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: { __typename?: 'ResponseType', success: boolean, message: string } };

export type DeleteAvatarMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAvatarMutation = { __typename?: 'Mutation', deleteAvatar: { __typename?: 'ResponseType', success: boolean, message: string } };

export type SearchUsersQueryVariables = Exact<{
  input: SearchUsersInput;
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: Array<{ __typename?: 'UserType', id: string, name?: string | null, avatarUrl?: string | null }> };


export const GoogleLoginDocument = gql`
    mutation GoogleLogin($googleLoginInput: GoogleLoginInput!) {
  googleLogin(googleLoginInput: $googleLoginInput) {
    token
  }
}
    `;
export type GoogleLoginMutationFn = Apollo.MutationFunction<GoogleLoginMutation, GoogleLoginMutationVariables>;

/**
 * __useGoogleLoginMutation__
 *
 * To run a mutation, you first call `useGoogleLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleLoginMutation, { data, loading, error }] = useGoogleLoginMutation({
 *   variables: {
 *      googleLoginInput: // value for 'googleLoginInput'
 *   },
 * });
 */
export function useGoogleLoginMutation(baseOptions?: Apollo.MutationHookOptions<GoogleLoginMutation, GoogleLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleLoginMutation, GoogleLoginMutationVariables>(GoogleLoginDocument, options);
      }
export type GoogleLoginMutationHookResult = ReturnType<typeof useGoogleLoginMutation>;
export type GoogleLoginMutationResult = Apollo.MutationResult<GoogleLoginMutation>;
export type GoogleLoginMutationOptions = Apollo.BaseMutationOptions<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const RenewTokenDocument = gql`
    mutation RenewToken {
  renewToken {
    token
  }
}
    `;
export type RenewTokenMutationFn = Apollo.MutationFunction<RenewTokenMutation, RenewTokenMutationVariables>;

/**
 * __useRenewTokenMutation__
 *
 * To run a mutation, you first call `useRenewTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenewTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renewTokenMutation, { data, loading, error }] = useRenewTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useRenewTokenMutation(baseOptions?: Apollo.MutationHookOptions<RenewTokenMutation, RenewTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenewTokenMutation, RenewTokenMutationVariables>(RenewTokenDocument, options);
      }
export type RenewTokenMutationHookResult = ReturnType<typeof useRenewTokenMutation>;
export type RenewTokenMutationResult = Apollo.MutationResult<RenewTokenMutation>;
export type RenewTokenMutationOptions = Apollo.BaseMutationOptions<RenewTokenMutation, RenewTokenMutationVariables>;
export const GetUserNotificationsDocument = gql`
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

/**
 * __useGetUserNotificationsQuery__
 *
 * To run a query within a React component, call `useGetUserNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserNotificationsQuery, GetUserNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserNotificationsQuery, GetUserNotificationsQueryVariables>(GetUserNotificationsDocument, options);
      }
export function useGetUserNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserNotificationsQuery, GetUserNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserNotificationsQuery, GetUserNotificationsQueryVariables>(GetUserNotificationsDocument, options);
        }
export function useGetUserNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserNotificationsQuery, GetUserNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserNotificationsQuery, GetUserNotificationsQueryVariables>(GetUserNotificationsDocument, options);
        }
export type GetUserNotificationsQueryHookResult = ReturnType<typeof useGetUserNotificationsQuery>;
export type GetUserNotificationsLazyQueryHookResult = ReturnType<typeof useGetUserNotificationsLazyQuery>;
export type GetUserNotificationsSuspenseQueryHookResult = ReturnType<typeof useGetUserNotificationsSuspenseQuery>;
export type GetUserNotificationsQueryResult = Apollo.QueryResult<GetUserNotificationsQuery, GetUserNotificationsQueryVariables>;
export const MarkNotificationAsReadDocument = gql`
    mutation MarkNotificationAsRead($notificationId: String!) {
  markNotificationAsRead(notificationId: $notificationId) {
    success
    message
  }
}
    `;
export type MarkNotificationAsReadMutationFn = Apollo.MutationFunction<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;

/**
 * __useMarkNotificationAsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationAsReadMutation, { data, loading, error }] = useMarkNotificationAsReadMutation({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useMarkNotificationAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>(MarkNotificationAsReadDocument, options);
      }
export type MarkNotificationAsReadMutationHookResult = ReturnType<typeof useMarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationResult = Apollo.MutationResult<MarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const DeleteNotificationDocument = gql`
    mutation DeleteNotification($notificationId: String!) {
  deleteNotification(notificationId: $notificationId) {
    success
    message
  }
}
    `;
export type DeleteNotificationMutationFn = Apollo.MutationFunction<DeleteNotificationMutation, DeleteNotificationMutationVariables>;

/**
 * __useDeleteNotificationMutation__
 *
 * To run a mutation, you first call `useDeleteNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNotificationMutation, { data, loading, error }] = useDeleteNotificationMutation({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useDeleteNotificationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNotificationMutation, DeleteNotificationMutationVariables>(DeleteNotificationDocument, options);
      }
export type DeleteNotificationMutationHookResult = ReturnType<typeof useDeleteNotificationMutation>;
export type DeleteNotificationMutationResult = Apollo.MutationResult<DeleteNotificationMutation>;
export type DeleteNotificationMutationOptions = Apollo.BaseMutationOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const OnNotificationReceivedDocument = gql`
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

/**
 * __useOnNotificationReceivedSubscription__
 *
 * To run a query within a React component, call `useOnNotificationReceivedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNotificationReceivedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNotificationReceivedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnNotificationReceivedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnNotificationReceivedSubscription, OnNotificationReceivedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNotificationReceivedSubscription, OnNotificationReceivedSubscriptionVariables>(OnNotificationReceivedDocument, options);
      }
export type OnNotificationReceivedSubscriptionHookResult = ReturnType<typeof useOnNotificationReceivedSubscription>;
export type OnNotificationReceivedSubscriptionResult = Apollo.SubscriptionResult<OnNotificationReceivedSubscription>;
export const CreatePartnerBindingDocument = gql`
    mutation CreatePartnerBinding($createPartnerBindingDto: CreatePartnerBindingDto!) {
  createPartnerBinding(createPartnerBindingDto: $createPartnerBindingDto) {
    id
    invitationCode
    expiresAt
    status
  }
}
    `;
export type CreatePartnerBindingMutationFn = Apollo.MutationFunction<CreatePartnerBindingMutation, CreatePartnerBindingMutationVariables>;

/**
 * __useCreatePartnerBindingMutation__
 *
 * To run a mutation, you first call `useCreatePartnerBindingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePartnerBindingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPartnerBindingMutation, { data, loading, error }] = useCreatePartnerBindingMutation({
 *   variables: {
 *      createPartnerBindingDto: // value for 'createPartnerBindingDto'
 *   },
 * });
 */
export function useCreatePartnerBindingMutation(baseOptions?: Apollo.MutationHookOptions<CreatePartnerBindingMutation, CreatePartnerBindingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePartnerBindingMutation, CreatePartnerBindingMutationVariables>(CreatePartnerBindingDocument, options);
      }
export type CreatePartnerBindingMutationHookResult = ReturnType<typeof useCreatePartnerBindingMutation>;
export type CreatePartnerBindingMutationResult = Apollo.MutationResult<CreatePartnerBindingMutation>;
export type CreatePartnerBindingMutationOptions = Apollo.BaseMutationOptions<CreatePartnerBindingMutation, CreatePartnerBindingMutationVariables>;
export const AcceptPartnerBindingDocument = gql`
    mutation AcceptPartnerBinding($acceptPartnerBindingDto: AcceptPartnerBindingDto!) {
  acceptPartnerBinding(acceptPartnerBindingDto: $acceptPartnerBindingDto) {
    id
    invitationCode
    expiresAt
    status
  }
}
    `;
export type AcceptPartnerBindingMutationFn = Apollo.MutationFunction<AcceptPartnerBindingMutation, AcceptPartnerBindingMutationVariables>;

/**
 * __useAcceptPartnerBindingMutation__
 *
 * To run a mutation, you first call `useAcceptPartnerBindingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptPartnerBindingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptPartnerBindingMutation, { data, loading, error }] = useAcceptPartnerBindingMutation({
 *   variables: {
 *      acceptPartnerBindingDto: // value for 'acceptPartnerBindingDto'
 *   },
 * });
 */
export function useAcceptPartnerBindingMutation(baseOptions?: Apollo.MutationHookOptions<AcceptPartnerBindingMutation, AcceptPartnerBindingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptPartnerBindingMutation, AcceptPartnerBindingMutationVariables>(AcceptPartnerBindingDocument, options);
      }
export type AcceptPartnerBindingMutationHookResult = ReturnType<typeof useAcceptPartnerBindingMutation>;
export type AcceptPartnerBindingMutationResult = Apollo.MutationResult<AcceptPartnerBindingMutation>;
export type AcceptPartnerBindingMutationOptions = Apollo.BaseMutationOptions<AcceptPartnerBindingMutation, AcceptPartnerBindingMutationVariables>;
export const RejectPartnerBindingDocument = gql`
    mutation RejectPartnerBinding($rejectPartnerBindingDto: RejectPartnerBindingDto!) {
  rejectPartnerBinding(rejectPartnerBindingDto: $rejectPartnerBindingDto) {
    success
    message
  }
}
    `;
export type RejectPartnerBindingMutationFn = Apollo.MutationFunction<RejectPartnerBindingMutation, RejectPartnerBindingMutationVariables>;

/**
 * __useRejectPartnerBindingMutation__
 *
 * To run a mutation, you first call `useRejectPartnerBindingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectPartnerBindingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectPartnerBindingMutation, { data, loading, error }] = useRejectPartnerBindingMutation({
 *   variables: {
 *      rejectPartnerBindingDto: // value for 'rejectPartnerBindingDto'
 *   },
 * });
 */
export function useRejectPartnerBindingMutation(baseOptions?: Apollo.MutationHookOptions<RejectPartnerBindingMutation, RejectPartnerBindingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectPartnerBindingMutation, RejectPartnerBindingMutationVariables>(RejectPartnerBindingDocument, options);
      }
export type RejectPartnerBindingMutationHookResult = ReturnType<typeof useRejectPartnerBindingMutation>;
export type RejectPartnerBindingMutationResult = Apollo.MutationResult<RejectPartnerBindingMutation>;
export type RejectPartnerBindingMutationOptions = Apollo.BaseMutationOptions<RejectPartnerBindingMutation, RejectPartnerBindingMutationVariables>;
export const RemovePartnerDocument = gql`
    mutation RemovePartner {
  removePartner {
    success
    message
  }
}
    `;
export type RemovePartnerMutationFn = Apollo.MutationFunction<RemovePartnerMutation, RemovePartnerMutationVariables>;

/**
 * __useRemovePartnerMutation__
 *
 * To run a mutation, you first call `useRemovePartnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePartnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePartnerMutation, { data, loading, error }] = useRemovePartnerMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemovePartnerMutation(baseOptions?: Apollo.MutationHookOptions<RemovePartnerMutation, RemovePartnerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePartnerMutation, RemovePartnerMutationVariables>(RemovePartnerDocument, options);
      }
export type RemovePartnerMutationHookResult = ReturnType<typeof useRemovePartnerMutation>;
export type RemovePartnerMutationResult = Apollo.MutationResult<RemovePartnerMutation>;
export type RemovePartnerMutationOptions = Apollo.BaseMutationOptions<RemovePartnerMutation, RemovePartnerMutationVariables>;
export const GetProfileWithPartnerDocument = gql`
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

/**
 * __useGetProfileWithPartnerQuery__
 *
 * To run a query within a React component, call `useGetProfileWithPartnerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileWithPartnerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileWithPartnerQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProfileWithPartnerQuery(baseOptions?: Apollo.QueryHookOptions<GetProfileWithPartnerQuery, GetProfileWithPartnerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileWithPartnerQuery, GetProfileWithPartnerQueryVariables>(GetProfileWithPartnerDocument, options);
      }
export function useGetProfileWithPartnerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileWithPartnerQuery, GetProfileWithPartnerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileWithPartnerQuery, GetProfileWithPartnerQueryVariables>(GetProfileWithPartnerDocument, options);
        }
export function useGetProfileWithPartnerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProfileWithPartnerQuery, GetProfileWithPartnerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileWithPartnerQuery, GetProfileWithPartnerQueryVariables>(GetProfileWithPartnerDocument, options);
        }
export type GetProfileWithPartnerQueryHookResult = ReturnType<typeof useGetProfileWithPartnerQuery>;
export type GetProfileWithPartnerLazyQueryHookResult = ReturnType<typeof useGetProfileWithPartnerLazyQuery>;
export type GetProfileWithPartnerSuspenseQueryHookResult = ReturnType<typeof useGetProfileWithPartnerSuspenseQuery>;
export type GetProfileWithPartnerQueryResult = Apollo.QueryResult<GetProfileWithPartnerQuery, GetProfileWithPartnerQueryVariables>;
export const GetPartnerStatusDocument = gql`
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

/**
 * __useGetPartnerStatusQuery__
 *
 * To run a query within a React component, call `useGetPartnerStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPartnerStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPartnerStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPartnerStatusQuery(baseOptions?: Apollo.QueryHookOptions<GetPartnerStatusQuery, GetPartnerStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPartnerStatusQuery, GetPartnerStatusQueryVariables>(GetPartnerStatusDocument, options);
      }
export function useGetPartnerStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPartnerStatusQuery, GetPartnerStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPartnerStatusQuery, GetPartnerStatusQueryVariables>(GetPartnerStatusDocument, options);
        }
export function useGetPartnerStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPartnerStatusQuery, GetPartnerStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPartnerStatusQuery, GetPartnerStatusQueryVariables>(GetPartnerStatusDocument, options);
        }
export type GetPartnerStatusQueryHookResult = ReturnType<typeof useGetPartnerStatusQuery>;
export type GetPartnerStatusLazyQueryHookResult = ReturnType<typeof useGetPartnerStatusLazyQuery>;
export type GetPartnerStatusSuspenseQueryHookResult = ReturnType<typeof useGetPartnerStatusSuspenseQuery>;
export type GetPartnerStatusQueryResult = Apollo.QueryResult<GetPartnerStatusQuery, GetPartnerStatusQueryVariables>;
export const GetProfileDocument = gql`
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

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export function useGetProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileSuspenseQueryHookResult = ReturnType<typeof useGetProfileSuspenseQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    success
    message
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UploadAvatarDocument = gql`
    mutation UploadAvatar($input: UploadAvatarInput!) {
  uploadAvatar(input: $input) {
    success
    message
  }
}
    `;
export type UploadAvatarMutationFn = Apollo.MutationFunction<UploadAvatarMutation, UploadAvatarMutationVariables>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UploadAvatarMutation, UploadAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(UploadAvatarDocument, options);
      }
export type UploadAvatarMutationHookResult = ReturnType<typeof useUploadAvatarMutation>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<UploadAvatarMutation, UploadAvatarMutationVariables>;
export const DeleteAvatarDocument = gql`
    mutation DeleteAvatar {
  deleteAvatar {
    success
    message
  }
}
    `;
export type DeleteAvatarMutationFn = Apollo.MutationFunction<DeleteAvatarMutation, DeleteAvatarMutationVariables>;

/**
 * __useDeleteAvatarMutation__
 *
 * To run a mutation, you first call `useDeleteAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAvatarMutation, { data, loading, error }] = useDeleteAvatarMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAvatarMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAvatarMutation, DeleteAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAvatarMutation, DeleteAvatarMutationVariables>(DeleteAvatarDocument, options);
      }
export type DeleteAvatarMutationHookResult = ReturnType<typeof useDeleteAvatarMutation>;
export type DeleteAvatarMutationResult = Apollo.MutationResult<DeleteAvatarMutation>;
export type DeleteAvatarMutationOptions = Apollo.BaseMutationOptions<DeleteAvatarMutation, DeleteAvatarMutationVariables>;
export const SearchUsersDocument = gql`
    query SearchUsers($input: SearchUsersInput!) {
  searchUsers(input: $input) {
    id
    name
    avatarUrl
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables> & ({ variables: SearchUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export function useSearchUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersSuspenseQueryHookResult = ReturnType<typeof useSearchUsersSuspenseQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;