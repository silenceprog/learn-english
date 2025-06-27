import { ShowWord, Word } from "@/app/ShowWord";
import { useEffect, useState } from "react";

interface Tabs {
  currentTab: "ALL" | "DO" | "DONE";
}
export function ShowWords(Tabs: Tabs) {
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
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(
          "https://learn-english-6ufl.onrender.com/api/words/by-language",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (!response.ok) {
          console.error("Помилка при отриманні слів");
        }

        const data = await response.json();
        setWords(data.data);
        console.log(data.data);
        console.log(Tabs.currentTab); // якщо API повертає { words: [...] }
      } catch (err: any) {
        console.log(err.message || "Щось пішло не так");
      }
    };

    fetchWords();
  }, []);
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {words.map((word, i) => (
        <ShowWord key={i} word={word} />
      ))}
    </div>
  );
}
