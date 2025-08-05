import { create } from "zustand";
import { useAlertStore } from "@/states/alertStore";

type AuthState = {
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
  refresh: () => Promise<string | null>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("accessToken")
      : false,

  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
    set({ isAuthenticated: true });
  },

  logout: async () => {
    try {
      const response = await fetch(
        "https://learn-english-6ufl.onrender.com/api/auth/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!response.ok) {
        useAlertStore.getState().addAlert("Failed to logout", "error");
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      set({ isAuthenticated: false });
    } catch (error) {
      console.error("Logout error:", error);
      set({ isAuthenticated: false });
      return null;
    }
  },

  refresh: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        useAlertStore.getState().addAlert("No refresh token", "error");
      }

      const response = await fetch(
        "https://learn-english-6ufl.onrender.com/api/auth/refresh",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        },
      );

      if (!response.ok) {
        useAlertStore.getState().addAlert("Failed to refresh", "error");
        get().logout();
        return null;
      }

      const data = await response.json();

      if (!data.accessToken) {
        useAlertStore.getState().addAlert("No accessToken returned", "error");
        return null;
      }
      get().setAccessToken(data.accessToken);

      return data.accessToken;
    } catch (error) {
      console.error("Refresh token error:", error);
      get().logout();
      return null;
    }
  },
}));
