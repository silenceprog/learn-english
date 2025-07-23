import { create } from "zustand/react";

type Settings = {
  global_language: string;
  current_language: string;
  purposes: string[];
  current_level: string;
};

type SettingsStore = {
  settings: Settings;
  fetchSettings: () => void;
};

export const useUserSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    global_language: "",
    current_language: "",
    purposes: [""],
    current_level: "",
  },
  fetchSettings: async () => {
    try {
      const res = await fetch(
        "https://learn-english-6ufl.onrender.com/api/settings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch settings ${res.status}`,
        );
      }

      const data = await res.json();
      set({ settings: data });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  },
}));
