import { Button } from "@/shared/ui/Button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { ShowWords } from "@/app/ShowWords";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Pagination from "@/app/Pagination";
import CreateWordButton from "@/app/CreateWordButton";

export function MyWordsBlock() {
  const [activeTab, setActiveTab] = useState<"ALL" | "LEARNING" | "LEARNED">(
    "ALL",
  );
  const [totalWords, setTotalWords] = useState(0);
  const [maxPages, setMaxPages] = useState(1);
  const limits = [1, 2, 3, 5, 10];
  const [page, setPage] = useState(1);
  const [wordsOnPage, setWordsOnPage] = useState(limits[4]);
  const nextPage = () => {
    if (page + 1 <= maxPages) {
      setPage(page + 1);
    }
  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
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

          <CreateWordButton />
        </div>
        <div>
          <DropdownMenu.Root>
            К-сть слов на сторінку:
            <DropdownMenu.Trigger className="ml-1 border py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-md">
              {wordsOnPage}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="z-50 min-w-[8rem] bg-white shadow-md border-1-gray-200">
              {limits.map((limit) => (
                <DropdownMenu.Item
                  key={limit}
                  className="flex justify-center hover:bg-gray-100 cursor-pointer border-b"
                  onSelect={() => {
                    setWordsOnPage(limit);
                    setPage(1);
                  }}
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
        currentPage={page}
        maxPages={setMaxPages}
      />
      <Pagination
        page={page}
        nextPage={nextPage}
        prevPage={prevPage}
        prevDisabled={page - 1 < 1}
        nextDisabled={page + 1 > maxPages}
      />
    </div>
  );
}
