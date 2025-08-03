import { create } from "zustand";
import { secureFetch } from "@/lib/secureFetch";
import { useAlertStore } from "@/states/alertStore";

type States = {
  flashcards: Word[];
  fetch: () => Promise<void>;
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

export type skillType = "VOCABULARY";

const { addAlert } = useAlertStore.getState();

export const useGetFlashcards = create<States>((set) => ({
  flashcards: [],
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
      const res = await secureFetch(
        "https://learn-english-6ufl.onrender.com/api/words/mark-batch-learned",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            wordIds: IDs,
            progressData: {
              timeSpent: 30,
              skillType: skillType,
              isPassed: true,
            },
          }),
        },
      );
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
