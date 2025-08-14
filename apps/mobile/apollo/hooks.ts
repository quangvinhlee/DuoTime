import { useMutation, useQuery } from "@apollo/client";
import { GOOGLE_LOGIN, GET_PROFILE, PUBLIC_ROUTE } from "../graphql/auth";

// Google Login Hook
export const useGoogleLogin = () => {
  return useMutation(GOOGLE_LOGIN);
};

// Get Profile Hook
export const useGetProfile = () => {
  return useQuery(GET_PROFILE);
};
