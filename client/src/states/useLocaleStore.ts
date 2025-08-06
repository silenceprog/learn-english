import { create } from "zustand/react";

interface LocaleState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale:
    typeof window !== "undefined"
      ? localStorage.getItem("locale") || "en"
      : "en",
  setLocale: (locale) => {
    set({ locale });
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }
  },
}));
