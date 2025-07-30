import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Get the GraphQL endpoint from environment or use default
const GRAPHQL_ENDPOINT =
  process.env.EXPO_PUBLIC_GRAPHQL_URL || "http://192.168.4.86:3000/graphql";

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
