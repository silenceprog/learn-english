import { create } from "zustand";
import { secureFetch } from "@/lib/secureFetch";
import { useAlertStore } from "@/states/alertStore";

type States = {
  flashcards: Word[];
  fetch: (skillType: skillType) => Promise<void>;
  markAsLearned: (skillType: skillType, IDs: number[]) => Promise<void>;
  clear: () => void;
};

export type Word = {
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

export type skillType =
  | "FLASHCARDS"
  | "REVERSE_FLASHCARDS"
  | "MATCHING"
  | "FILL_IN_THE_BLANK";

const { addAlert } = useAlertStore.getState();

export const useGetFlashcards = create<States>((set) => ({
  flashcards: [],
  fetch: async (skillType) => {
    try {
      const params = new URLSearchParams({
        limit: "10",
        taskType: skillType,
      });

      const url = `/api/flashcards?${params.toString()}`;

      const res = await secureFetch(url);
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
      set({ flashcards: json });

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
  markAsLearned: async (skillType, IDs) => {
    try {
      const res = await secureFetch("/api/words/mark-batch-learned", {
        method: "POST",
        body: JSON.stringify({
          wordIds: IDs,
          progressData: {
            correct: true,
            timeSpent: 30,
            taskType: skillType,
            isPassed: true,
          },
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        addAlert(
          `Помилка: ${errorData.message || "Сталася помилка на сервері"}`,
          "error",
        );
        return;
      }

      addAlert("Прогрес успішно оновлено", "success");
    } catch (error) {
      addAlert("Помилка з'єднання з сервером. Спробуйте пізніше.", "error");
      console.error(error);
    }
  },
  clear: () => set({ flashcards: [] }),
}));
