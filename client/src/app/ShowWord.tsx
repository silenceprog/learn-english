import { Volume2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";

export interface Word {
  text: string;
  translate: string;
  example: string;
  totalProgress: number;
  voice: string;
  phonetic?: string;
  phoneticUS?: string;
  audio?: string;
  audioUS?: string;
}
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
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{word.text}</h3>
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
      <p className="text-xs text-gray-500 italic mb-2">{word.example}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${word.totalProgress >= 80 ? "bg-lime-500" : "bg-blue-600"}`}
          style={{ width: `${word.totalProgress}%` }}
        ></div>
      </div>
    </div>
  );
}
