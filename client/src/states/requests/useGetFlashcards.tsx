import { create } from "zustand";
import { secureFetch } from "@/lib/secureFetch";
import { useAlertStore } from "@/states/alertStore";

type States = {
  data: Word[];
  fetch: () => Promise<void>;
  clear: () => void;
};

type Word = {
  id: number;
  text: string;
  language: string;
  translate: string[];
  examples: string[];
  phonetic: string | null;
  audio: string | null;
  phoneticUS: string | null;
  audioUS: string | null;
  totalProgress: number;
  isLearned: boolean;
  nextReviewAt: string;
  reviewInterval: number;
  attempts: number;
  correctCount: number;
};

export const useGetFlashcards = create<States>((set) => ({
  data: [],
  fetch: async () => {
    try {
      const res = await secureFetch(
        "https://learn-english-6ufl.onrender.com/api/flashcards?limit=10",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        useAlertStore
          .getState()
          .addAlert(
            json?.message || `Failed to fetch card ${res.status}`,
            "error",
          );
        return;
      }
      if (!Array.isArray(json)) {
        useAlertStore.getState().addAlert("Unexpected data format", "error");
        return;
      }
      set({ data: json });

      console.log(json);
      if (json.length < 10) {
        useAlertStore
          .getState()
          .addAlert(
            `Need more than 10 unlearned words to start this exercise. You have only ${json.length} cards!`,
            "info",
          );
      }
    } catch (error) {
      console.error(error);
      useAlertStore.getState().addAlert("Something went wrong!", "error");
    }
  },
  clear: () => set({ data: [] }),
}));
