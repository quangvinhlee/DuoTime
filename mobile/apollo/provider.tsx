import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./client";

interface ApolloWrapperProps {
  children: React.ReactNode;
}

export const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
