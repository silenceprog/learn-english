import { Volume2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useAlertStore } from "@/states/alertStore";
import {
  useDictionaryStore,
  Word,
} from "@/states/requests/useGetDictionaryWords";

interface Props {
  word: Word;
}
const playAudio = (thisSong: string) => {
  const audio = new Audio(thisSong);
  audio
    .play()
    .catch((err) => console.error("Не вдалося відтворити аудіо:", err));
};

export function ShowWord({ word }: Props) {
  const { addAlert } = useAlertStore();
  const { fetchWords } = useDictionaryStore();
  async function deleteWord() {
    try {
      const response = await fetch(
        `https://learn-english-6ufl.onrender.com/api/words/${word.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Помилка $response.status`;
        throw new Error(errorMessage);
      }

      addAlert("Слово видалено успішно", "success");
      fetchWords();
    } catch (err) {
      if (err instanceof Error) {
        addAlert(err.message, "error");
      } else {
        addAlert("Something went wrong", "error");
      }
    }
  }
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="w-full mb-2">
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="font-medium">{word.text}</h3>
            <Button size="sm" color="white" onClick={deleteWord}>
              ❌
            </Button>
          </div>
          <p className="text-sm text-blue-700">{word.translate}</p>
          <div className="flex flex-row gap-5">
            {word.phonetic !== "none" && (
              <div className="flex flex-row justify-center items-center gap-1">
                <p>UK</p>
                {word.audio !== "none" && (
                  <Button
                    size="sm"
                    color="outline"
                    onClick={() => {
                      if (word.audio) {
                        playAudio(word.audio);
                      }
                    }}
                  >
                    <Volume2 className="h-5 w-5 text-blue-700" />
                  </Button>
                )}
                <p>{word.phonetic}</p>
              </div>
            )}
            {word.phoneticUS !== null && (
              <div className="flex flex-row justify-center items-center gap-1">
                <p>US</p>
                {word.audioUS !== null && (
                  <Button
                    size="sm"
                    color="outline"
                    onClick={() => {
                      if (word.audioUS) {
                        playAudio(word.audioUS);
                      }
                    }}
                  >
                    <Volume2 className="h-5 w-5 text-blue-700" />
                  </Button>
                )}
                <p>{word.phoneticUS}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 italic mb-2">{word.examples}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${word.totalProgress >= 80 ? "bg-lime-500" : "bg-blue-600"}`}
          style={{ width: `${word.totalProgress}%` }}
        ></div>
      </div>
    </div>
  );
}
