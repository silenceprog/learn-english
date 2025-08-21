"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, RefreshCw, Shuffle, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useGetFlashcards } from "@/states/requests/useGetFlashcards";

interface MatchItem {
  id: string;
  content: string;
  type: "word" | "translation";
  matchId: number;
}

export default function MatchingPage() {
  const { flashcards, markAsLearned } = useGetFlashcards();
  const [leftItems, setLeftItems] = useState<MatchItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [correctMatches, setCorrectMatches] = useState<string[]>([]);
  const [incorrectMatches, setIncorrectMatches] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctIds, setCorrectIDs] = useState<number[]>([]);
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const left: MatchItem[] = flashcards.map((pair) => ({
      id: `word-${pair.id}`,
      content: pair.text,
      type: "word" as const,
      matchId: pair.id,
    }));

    const right: MatchItem[] = shuffleArray(
      flashcards.map((pair) => ({
        id: `translation-${pair.id}`,
        content: pair.translate.toString(),
        type: "translation" as const,
        matchId: pair.id,
      })),
    );

    setLeftItems(left);
    setRightItems(right);
    setMatches({});
    setCorrectMatches([]);
    setIncorrectMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleLeftClick = (id: string) => {
    if (matches[id] || correctMatches.includes(id)) return;
    setSelectedLeft(selectedLeft === id ? null : id);
    setSelectedRight(null);
  };

  const handleRightClick = (id: string) => {
    if (Object.values(matches).includes(id) || correctMatches.includes(id))
      return;

    if (selectedLeft) {
      const leftItem = leftItems.find((item) => item.id === selectedLeft);
      const rightItem = rightItems.find((item) => item.id === id);

      if (leftItem && rightItem) {
        const newMatches = { ...matches, [selectedLeft]: id };
        setMatches(newMatches);

        if (leftItem.matchId === rightItem.matchId) {
          setCorrectMatches([...correctMatches, selectedLeft]);
          setCorrectIDs([...correctIds, leftItem.matchId]);
        } else {
          setIncorrectMatches([...incorrectMatches, selectedLeft]);
        }

        setSelectedLeft(null);
        setSelectedRight(null);

        // Проверяем завершение игры
        if (Object.keys(newMatches).length === flashcards.length) {
          setTimeout(() => setIsCompleted(true), 500);
        }
      }
    } else {
      setSelectedRight(selectedRight === id ? null : id);
      setSelectedLeft(null);
    }
  };

  const getItemStatus = (id: string, type: "left" | "right") => {
    if (type === "left") {
      if (correctMatches.includes(id)) return "correct";
      if (incorrectMatches.includes(id)) return "incorrect";
      if (selectedLeft === id) return "selected";
    } else {
      const matchedLeftId = Object.keys(matches).find(
        (leftId) => matches[leftId] === id,
      );
      if (matchedLeftId) {
        if (correctMatches.includes(matchedLeftId)) return "correct";
        if (incorrectMatches.includes(matchedLeftId)) return "incorrect";
      }
      if (selectedRight === id) return "selected";
    }
    return "default";
  };

  const getItemClass = (status: string) => {
    const baseClass =
      "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center";

    switch (status) {
      case "correct":
        return `${baseClass} bg-green-50 border-green-300 text-green-800`;
      case "incorrect":
        return `${baseClass} bg-red-50 border-red-300 text-red-800`;
      case "selected":
        return `${baseClass} bg-blue-50 border-blue-300 text-blue-800 scale-105`;
      default:
        return `${baseClass} bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50`;
    }
  };

  const correctCount = correctMatches.length;
  const progress = (correctCount / flashcards.length) * 100;

  if (isCompleted) {
    const score = Math.round((correctCount / flashcards.length) * 100);
    if (correctIds) {
      markAsLearned("MATCHING", correctIds);
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-blue-700 mb-2">Отлично!</h1>
            <p className="text-lg text-muted-foreground">
              Вы завершили упражнение на соответствие
            </p>
          </div>

          <Card className="border-2 border-green-100 mb-6">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-green-700 mb-2">
                  {score}%
                </p>
                <p className="text-lg text-muted-foreground">
                  {correctCount} из {flashcards.length} правильных соответствий
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Правильно: {correctCount}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <X className="h-4 w-4 text-red-600" />
                  <span>Неправильно: {flashcards.length - correctCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button
              onClick={initializeGame}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Играть заново
            </Button>
            <Link href="/exercises">
              <Button variant="outline" className="w-full bg-transparent">
                Вернуться к упражнениям
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад к упражнениям</span>
        </Link>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">
            Упражнение на соответствие
          </h1>
          <div className="flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">
              Правильно: {correctCount}/{flashcards.length}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Прогресс</span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-blue-100 mb-6">
          <CardHeader>
            <CardTitle className="text-center text-blue-700">
              Соедините слова с их переводами
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Нажмите на слово слева, затем на его перевод справа
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Левая колонка - слова */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-center text-blue-700 mb-4">
                  Английские слова
                </h3>
                {leftItems.map((item) => {
                  const status = getItemStatus(item.id, "left");
                  return (
                    <div
                      key={item.id}
                      className={getItemClass(status)}
                      onClick={() => handleLeftClick(item.id)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium">{item.content}</span>
                        {status === "correct" && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                        {status === "incorrect" && (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Правая колонка - переводы */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-center text-blue-700 mb-4">
                  Переводы
                </h3>
                {rightItems.map((item) => {
                  const status = getItemStatus(item.id, "right");
                  return (
                    <div
                      key={item.id}
                      className={getItemClass(status)}
                      onClick={() => handleRightClick(item.id)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>{item.content}</span>
                        {status === "correct" && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                        {status === "incorrect" && (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={initializeGame}
            variant="outline"
            className="gap-2 bg-transparent cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Перемешать заново
          </Button>
        </div>
      </div>
    </div>
  );
}
