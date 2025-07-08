import { Volume2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";

export interface Word {
  text: string;
  translate: string;
  example: string;
  progress: number;
  voice: string;
}
interface Props {
  word: Word;
}
export function ShowWord({ word }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{word.text}</h3>
          <p className="text-sm text-blue-700">{word.translate}</p>
        </div>
        <Button color="white">
          <Volume2 className="h-4 w-4 text-blue-700" />
          <span className="sr-only">Прослушать</span>
        </Button>
      </div>
      <p className="text-xs text-gray-500 italic mb-2">{word.example}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${word.progress >= 80 ? "bg-lime-500" : "bg-blue-600"}`}
          style={{ width: `${word.progress}%` }}
        ></div>
      </div>
    </div>
  );
}
