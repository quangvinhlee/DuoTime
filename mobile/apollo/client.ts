import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  uri:
    process.env.EXPO_PUBLIC_GRAPHQL_URL || "http://192.168.0.79:3000/graphql",
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: (
      process.env.EXPO_PUBLIC_GRAPHQL_WS_URL || "ws://192.168.0.79:3000/graphql"
    ).replace("http", "ws"),
    connectionParams: async () => {
      // Get token for WebSocket authentication
      const token = await SecureStore.getItemAsync("jwt_token");
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  })
);

const authLink = setContext(async (_, { headers }) => {
  // Get token from SecureStore
  const token = await SecureStore.getItemAsync("jwt_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Split links: HTTP for queries/mutations, WebSocket for subscriptions
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});
