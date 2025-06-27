import { Button } from "@/shared/ui/Button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { ShowWords } from "@/app/ShowWords";

export function MyWordsBlock() {
  const [activeTab, setActiveTab] = useState<"ALL" | "DO" | "DONE">("ALL");
  return (
    <div>
      <div className="text-xl font-bold text-blue-700 flex items-center justify-between">
        <span>Мой словарь</span>
        <Button color="outlineBlue" className="text-blue-700">
          <div className="flex items-center justify-center flex-row">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="text-xl">Повторить слова</span>
          </div>
        </Button>
      </div>
      <p className="text-gray-500 py-2">Всего изучено слов: 5</p>
      <div>
        <Button
          color={activeTab === "ALL" ? "active" : "outline"}
          rounded="left"
          onClick={() => {
            setActiveTab("ALL");
          }}
        >
          Все слова
        </Button>
        <Button
          color={activeTab === "DO" ? "active" : "outline"}
          rounded="none"
          onClick={() => {
            setActiveTab("DO");
          }}
        >
          Изучаемые
        </Button>
        <Button
          color={activeTab === "DONE" ? "active" : "outline"}
          rounded="right"
          onClick={() => {
            setActiveTab("DONE");
          }}
        >
          Изученные
        </Button>
      </div>
      <ShowWords currentTab={activeTab} />
    </div>
  );
}
