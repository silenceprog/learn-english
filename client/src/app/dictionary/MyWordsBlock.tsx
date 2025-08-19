import { Button } from "@/shared/ui/Button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowWords } from "@/app/dictionary/ShowWords";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Pagination from "@/app/dictionary/Pagination";
import CreateWordButton from "@/app/dictionary/CreateWordButton";
import { useDictionaryStore } from "@/states/requests/useGetDictionaryWords";
import { useTranslations } from "next-intl";

export function MyWordsBlock() {
  const [activeTab, setActiveTab] = useState<"ALL" | "LEARNING" | "LEARNED">(
    "ALL",
  );
  const {
    setCurrentTab,
    fetchWords,
    setWordsLimit,
    learned,
    setCurrentPage,
    totalPages,
  } = useDictionaryStore();
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
  useEffect(() => {
    setCurrentTab(activeTab);
    setWordsLimit(wordsOnPage);
    setCurrentPage(page);
    setMaxPages(totalPages);
    fetchWords();
  }, [activeTab, wordsOnPage, page, totalPages]);
  const t = useTranslations();
  return (
    <div>
      <div className="text-xl font-bold text-blue-700 flex items-center justify-between">
        <span>{t("myDictionary")}</span>
        <Button color="outlineBlue" className="text-blue-700">
          <div className="flex items-center justify-center flex-row">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="text-xl">{t("repeatWords")}</span>
          </div>
        </Button>
      </div>
      <p className="text-gray-500 py-2">
        {t("totalLearnedWords")} {learned}
      </p>
      <div className="flex justify-between">
        <div>
          <Button
            color={activeTab === "ALL" ? "active" : "outline"}
            rounded="left"
            onClick={() => {
              setActiveTab("ALL");
            }}
          >
            {t("allWords")}
          </Button>
          <Button
            color={activeTab === "LEARNING" ? "active" : "outline"}
            rounded="none"
            onClick={() => {
              setActiveTab("LEARNING");
            }}
          >
            {t("learningWords")}
          </Button>
          <Button
            color={activeTab === "LEARNED" ? "active" : "outline"}
            rounded="right"
            onClick={() => {
              setActiveTab("LEARNED");
            }}
          >
            {t("learnedWords")}
          </Button>

          <CreateWordButton />
        </div>
        <div>
          <DropdownMenu.Root>
            {t("wordsPerPage")}
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
      <ShowWords />
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
