import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { UserType } from "@/generated/graphql";
import { getPushToken } from "@/utils/pushToken";

interface AuthState {
  token: string | null;
  user: UserType | null;
  pushToken: string | null;
  setAuth: (token: string, user: UserType) => Promise<void>;
  setPushToken: (pushToken: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  pushToken: null,
  setAuth: async (token, user) => {
    await SecureStore.setItemAsync("jwt_token", token);
    set({ token, user });
  },
  setPushToken: (pushToken) => {
    set({ pushToken });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    set({ token: null, user: null, pushToken: null });
  },
}));
