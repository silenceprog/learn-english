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
      try {
        const response = await fetch(
          `https://learn-english-6ufl.onrender.com/api/words/by-language?limit=${wordsLimit}&page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        const data = await response.json();
        setWords(data.data);
        getCountWords(data.total);
        maxPages(data.pages);
        console.log(data.data);
        console.log(currentTab); // якщо API повертає { words: [...] }
      } catch {
        console.log("Щось пішло не так1");
      }
    };
    if (isLoggedIn) {
      fetchWords();
    }
  }, [isLoggedIn, wordsLimit, currentPage]);
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {words.map((word, i) => (
        <ShowWord key={i} word={word} />
      ))}
    </div>
  );
}
