import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { UserType } from "@/generated/graphql";

interface AuthState {
  token: string | null;
  user: UserType | null;
  setAuth: (token: string, user: UserType) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: async (token, user) => {
    await SecureStore.setItemAsync("jwt_token", token);
    set({ token, user });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    set({ token: null, user: null });
  },
}));
