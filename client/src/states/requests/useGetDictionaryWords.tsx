import { create } from "zustand";

export interface DictionaryResponse {
  data: Word[];
  page: number;
  limit: number;
  total: number;
  learning: number;
  learned: number;
  pages: number;
}

export interface WordProgress {
  id: number;
  userId: number;
  wordId: number;
  taskType: "TRANSLATION" | "MATCHING" | "LISTENING";
  isPassed: boolean;
  score: number;
  attempts: number;
}
export interface Word {
  id: number;
  text: string;
  language: string;
  translate: string[];
  definitions: string[];
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  partOfSpeech: string;
  createdAt: string; // ISO date string
  totalProgress: number;
  isLearned: boolean;
  phonetic: string;
  audio: string;
  phoneticUS: string;
  audioUS: string;
  userId: number;
  progresses: WordProgress[];
}

interface DictionaryStore {
  currentTab: "ALL" | "LEARNING" | "LEARNED";
  wordsLimit: number;
  currentPage: number;
  words: Word[];
  totalWords: number;
  totalPages: number;
  setCurrentTab: (tab: "ALL" | "LEARNING" | "LEARNED") => void;
  setWordsLimit: (limit: number) => void;
  setCurrentPage: (page: number) => void;
  fetchWords: () => Promise<void>;
}

export const useDictionaryStore = create<DictionaryStore>((set, get) => ({
  currentTab: "ALL",
  wordsLimit: 10,
  currentPage: 1,
  words: [],
  totalWords: 0,
  totalPages: 0,

  setCurrentTab: (tab) => {
    set({ currentTab: tab });
  },

  setWordsLimit: (limit) => {
    set({ wordsLimit: limit });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  fetchWords: async () => {
    const { currentTab, wordsLimit, currentPage } = get();
    const baseUrl =
      "https://learn-english-6ufl.onrender.com/api/words/by-language";
    const params = new URLSearchParams({
      limit: wordsLimit.toString(),
      page: currentPage.toString(),
      type: currentTab.toString(),
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      set({
        words: data.data,
        totalWords: data.total,
        totalPages: data.pages,
      });
    } catch (error) {
      console.log("Щось пішло не так", error);
    }
  },
}));
