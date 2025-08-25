import { create } from "zustand/react";
import { secureFetch } from "@/lib/secureFetch";

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
    const params = new URLSearchParams({
      query: inputtedChars,
    });
    const url = `/api/translate/suggestions/?${params}`;
    try {
      const response = await secureFetch(url);
      const data = await response.json();
      set({ suggestions: data.suggestions });
    } catch (error) {
      console.error(error);
    }
  },
}));
