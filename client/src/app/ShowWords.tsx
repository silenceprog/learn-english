import { ShowWord, Word } from "@/app/ShowWord";
import { useEffect, useState } from "react";
import { useStates } from "@/states/useStates";

export function ShowWords({
  currentTab,
  getCountWords,
  wordsLimit,
  currentPage,
  maxPages,
}: {
  currentTab: "ALL" | "LEARNING" | "LEARNED";
  getCountWords: (count: number) => void;
  wordsLimit: number;
  currentPage: number;
  maxPages: (count: number) => void;
}) {
  const data = [
    {
      text: "accomplish",
      translate: "достигать, выполнять",
      example: '"She accomplished all her goals for the year."',
      progress: 33,
      voice: "http../sdfsdf.ua",
    },
    {
      text: "accomplish",
      translate: "достигать, выполнять",
      example: '"She accomplished all her goals for the year."',
      progress: 33,
      voice: "http../sdfsdf.ua",
    },
    {
      text: "accomplish",
      translate: "достигать, выполнять",
      example: '"She accomplished all her goals for the year."',
      progress: 33,
      voice: "http../sdfsdf.ua",
    },
  ];
  const [words, setWords] = useState<Word[]>(data);
  const { isLoggedIn } = useStates();
  useEffect(() => {
    const fetchWords = async () => {
      const baseUrl =
        "https://learn-english-6ufl.onrender.com/api/words/by-language";
      const params = new URLSearchParams({
        limit: wordsLimit.toString(),
        page: currentPage.toString(),
      });
      const tab: string = currentTab.toLowerCase();
      if (tab !== "all") {
        params.append("type", tab);
      }
      const url = `${baseUrl}?${params}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();
        setWords(data.data);
        getCountWords(data.total);
        maxPages(data.pages);
      } catch {
        console.log("Щось пішло не так1");
      }
    };
    if (isLoggedIn) {
      fetchWords();
    }
  }, [isLoggedIn, wordsLimit, currentPage, currentTab]);
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {words.map((word, i) => (
        <ShowWord key={i} word={word} />
      ))}
    </div>
  );
}
