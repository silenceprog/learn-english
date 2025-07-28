import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
  refresh: () => Promise<string | null>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("accessToken")
      : false,

  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
    set({ accessToken: token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    set({ accessToken: null, isAuthenticated: false });
  },

  refresh: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await fetch(
        "https://learn-english-6ufl.onrender.com/api/auth/refresh",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to refresh");

      const data = await response.json();

      // Ставимо в Zustand
      get().setAccessToken(data.accessToken);

      return data.accessToken;
    } catch (error) {
      console.error("Refresh token error:", error);
      get().logout();
      return null;
    }
  },
}));
