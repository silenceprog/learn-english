"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Volume2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { Progress } from "@/app/exercises/progress";
import { useGetFlashcards } from "@/states/requests/useGetFlashcards";

export default function FlashCard() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [unknownCards, setUnknownCards] = useState<number[]>([]);
  const { flashcards } = useGetFlashcards();

  const currentCardData = flashcards[currentCard];
  const progress = ((currentCard + 1) / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    if (unknownCards.includes(flashcards[currentCard].id)) {
      setUnknownCards((prev) =>
        prev.filter((cardId) => cardId !== flashcards[currentCard].id),
      );
    }
    if (!knownCards.includes(flashcards[currentCard].id)) {
      setKnownCards([...knownCards, flashcards[currentCard].id]);
    }
    nextCard();
  };

  const handleUnknown = () => {
    if (knownCards.includes(flashcards[currentCard].id)) {
      setKnownCards((prev) =>
        prev.filter((cardId) => cardId !== flashcards[currentCard].id),
      );
    }
    if (!unknownCards.includes(flashcards[currentCard].id)) {
      setUnknownCards([...unknownCards, flashcards[currentCard].id]);
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentCard < flashcards.length) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };
  const playAudio = (thisSong: string) => {
    const audio = new Audio(thisSong);
    audio
      .play()
      .catch((err) => console.error("Не вдалося відтворити аудіо:", err));
  };
  if (currentCard === flashcards.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-blue-700 mb-2">Отлично!</h1>
            <p className="text-lg text-muted-foreground">
              Вы завершили изучение карточек
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border-2 border-green-100">
              <div className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">
                  {knownCards.length}
                </p>
                <p className="text-sm text-muted-foreground">Знаю</p>
              </div>
            </div>
            <div className="border-2 border-red-100">
              <div className="p-4 text-center">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-700">
                  {unknownCards.length}
                </p>
                <p className="text-sm text-muted-foreground">Не знаю</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => {
                setCurrentCard(0);
                setIsFlipped(false);
                setKnownCards([]);
                setUnknownCards([]);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Повторить заново
            </Button>
            <Link href="/exercises">
              <Button color="outline" className="w-full bg-transparent">
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
          <h1 className="text-2xl font-bold text-blue-700">Карточки</h1>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Прогресс</span>
          <span className="text-sm text-muted-foreground">
            {currentCard + 1} из {flashcards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="perspective-1000 mb-8 ">
          <div
            className={`rounded-lg border bg-card text-card-foreground shadow-2xs relative h-80 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Передняя сторона */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-blue-700 mb-4">
                    {currentCardData.text}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {currentCardData.phonetic || currentCardData.audio ? (
                      <span className="font-semibold">{"UK: "}</span>
                    ) : null}
                    {currentCardData.phonetic && (
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-lg text-muted-foreground">
                          {currentCardData.phonetic}
                        </p>
                      </div>
                    )}
                    {currentCardData.audio ? (
                      <Button
                        className="rounded-full mr-4"
                        color="outlineBlue"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentCardData.audio) {
                            playAudio(currentCardData.audio);
                          }
                        }}
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    ) : null}
                    {currentCardData.phoneticUS || currentCardData.audioUS ? (
                      <span className="font-semibold">{"US: "}</span>
                    ) : null}
                    {currentCardData.phoneticUS && (
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-lg text-muted-foreground">
                          {currentCardData.phoneticUS}
                        </p>
                      </div>
                    )}
                    {currentCardData.audioUS ? (
                      <Button
                        className="rounded-full"
                        color="outlineBlue"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentCardData.audioUS) {
                            playAudio(currentCardData.audioUS);
                          }
                        }}
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="absolute bottom-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Нажмите для перевода
                  </p>
                </div>
              </div>
            </div>

            {/* Задняя сторона */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-green-50 to-green-100">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-green-700 mb-6">
                    {currentCardData.translate}
                  </h2>
                  <div className="space-y-3"></div>
                </div>
                <div className="absolute bottom-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Нажмите чтобы вернуться
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isFlipped && (
          <div className="flex gap-4 justify-center mb-6">
            <Button
              onClick={handleUnknown}
              color="outline"
              className="flex-1 max-w-40 border-red-200 text-red-700 hover:bg-red-50 bg-transparent flex flex-row justify-center items-center"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Не знаю
            </Button>
            <Button
              onClick={handleKnown}
              className="flex-1 max-w-40 bg-green-600 hover:bg-green-700 flex flex-row justify-center items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Знаю
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            onClick={prevCard}
            color={currentCard === 0 ? "disabled" : "outline"}
            disabled={currentCard === 0}
            className="flex flex-row justify-center items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>

          <Button
            onClick={handleFlip}
            color="outline"
            className="gap-2 bg-transparent flex flex-row justify-center items-center"
          >
            <RotateCcw className="h-4 w-4" />
            Перевернуть
          </Button>

          <Button
            onClick={nextCard}
            color={
              currentCard === flashcards.length - 1 ? "disabled" : "outline"
            }
            disabled={currentCard === flashcards.length - 1}
            className="flex flex-row justify-center items-center"
          >
            Вперед
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Знаю: {knownCards.length}
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-600" />
              Не знаю: {unknownCards.length}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
