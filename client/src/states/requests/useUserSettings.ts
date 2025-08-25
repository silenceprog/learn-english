import { create } from "zustand/react";
import { secureFetch } from "@/lib/secureFetch";
import { useLocaleStore } from "@/states/useLocaleStore";

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
      const res = await secureFetch("/api/settings");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch settings ${res.status}`,
        );
      }

      const data = await res.json();
      set({ settings: data });
      useLocaleStore.getState().setLocale(data.global_language.toLowerCase());
    } catch (err) {
      console.error(err);
    }
  },
}));
