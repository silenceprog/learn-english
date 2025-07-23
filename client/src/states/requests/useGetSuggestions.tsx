import { create } from "zustand/react";

type Suggestions = {
  inputtedChars: string;
  suggestions: string[];
  setInputtedChars: (chars: string) => void;
  clearSuggestions: () => void;
  fetch: () => Promise<void>;
};

export const useGetSuggestions = create<Suggestions>((set, get) => ({
  inputtedChars: "",
  suggestions: [],
  setInputtedChars: (chars) => {
    set({ inputtedChars: chars });
    get().fetch();
    console.log(get().suggestions);
  },
  clearSuggestions: () => {
    set({ suggestions: [] });
  },
  fetch: async () => {
    const { inputtedChars } = get();
    const baseUrl =
      "https://learn-english-6ufl.onrender.com/api/translate/suggestions";
    const params = new URLSearchParams({
      query: inputtedChars,
    });
    const url = `${baseUrl}?${params}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      set({ suggestions: data.suggestions });
    } catch (error) {
      console.error(error);
    }
  },
}));
