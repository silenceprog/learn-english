import { Button } from "@/shared/ui/Button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { ShowWords } from "@/app/ShowWords";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function MyWordsBlock() {
  const [activeTab, setActiveTab] = useState<"ALL" | "LEARNING" | "LEARNED">(
    "ALL",
  );
  const [totalWords, setTotalWords] = useState(0);
  const limits = [1, 2, 3, 5, 10];
  const [wordsOnPage, setWordsOnPage] = useState(limits[0]);
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
      <p className="text-gray-500 py-2">Всего изучено слов: {totalWords}</p>
      <div className="flex justify-between">
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
            color={activeTab === "LEARNING" ? "active" : "outline"}
            rounded="none"
            onClick={() => {
              setActiveTab("LEARNING");
            }}
          >
            Изучаемые
          </Button>
          <Button
            color={activeTab === "LEARNED" ? "active" : "outline"}
            rounded="right"
            onClick={() => {
              setActiveTab("LEARNED");
            }}
          >
            Изученные
          </Button>
        </div>
        <div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="border px-8 cursor-pointer hover:bg-gray-100 rounded-md">
              {wordsOnPage}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="z-50 min-w-[8rem] bg-white shadow-md border-1-gray-200">
              {limits.map((limit) => (
                <DropdownMenu.Item
                  key={limit}
                  className="flex justify-center hover:bg-gray-100 cursor-pointer border-b"
                  onSelect={() => setWordsOnPage(limit)}
                >
                  {limit}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
      <ShowWords
        currentTab={activeTab}
        getCountWords={setTotalWords}
        wordsLimit={wordsOnPage}
      />
    </div>
  );
}
