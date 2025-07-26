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

export default function FlashCard() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [unknownCards, setUnknownCards] = useState<number[]>([]);

  const flashcards = [
    {
      id: 1,
      word: "accomplish",
      transcription: "/əˈkʌm.plɪʃ/",
      translation: "достигать, выполнять",
      partOfSpeech: "глагол",
      example: "She accomplished all her goals for the year.",
      exampleTranslation: "Она достигла всех своих целей на год.",
      difficulty: "intermediate",
    },
    {
      id: 2,
      word: "brilliant",
      transcription: "/ˈbrɪl.jənt/",
      translation: "блестящий, яркий",
      partOfSpeech: "прилагательное",
      example: "That was a brilliant idea!",
      exampleTranslation: "Это была блестящая идея!",
      difficulty: "intermediate",
    },
    {
      id: 3,
      word: "challenge",
      transcription: "/ˈtʃæl.ɪndʒ/",
      translation: "вызов, испытание",
      partOfSpeech: "существительное",
      example: "Learning English is a real challenge.",
      exampleTranslation: "Изучение английского - настоящий вызов.",
      difficulty: "beginner",
    },
    {
      id: 4,
      word: "determine",
      transcription: "/dɪˈtɜː.mɪn/",
      translation: "определять, решать",
      partOfSpeech: "глагол",
      example: "We need to determine the best solution.",
      exampleTranslation: "Нам нужно определить лучшее решение.",
      difficulty: "advanced",
    },
    {
      id: 5,
      word: "essential",
      transcription: "/ɪˈsen.ʃəl/",
      translation: "существенный, важный",
      partOfSpeech: "прилагательное",
      example: "Water is essential for life.",
      exampleTranslation: "Вода необходима для жизни.",
      difficulty: "intermediate",
    },
  ];

  const currentCardData = flashcards[currentCard];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    if (!knownCards.includes(currentCard)) {
      setKnownCards([...knownCards, currentCard]);
    }
    nextCard();
  };

  const handleUnknown = () => {
    if (!unknownCards.includes(currentCard)) {
      setUnknownCards([...unknownCards, currentCard]);
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  if (currentCard >= flashcards.length) {
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
        {/*<Progress value={progress} className="h-2 mb-6" />*/}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="perspective-1000 mb-8">
          <div
            className={`relative h-80 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Передняя сторона */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-blue-700 mb-4">
                    {currentCardData.word}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <p className="text-lg text-muted-foreground">
                      {currentCardData.transcription}
                    </p>
                    <Button className="rounded-full">
                      <Volume2 className="h-5 w-5" />
                    </Button>
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
                    {currentCardData.translation}
                  </h2>
                  <div className="space-y-3">
                    <p className="text-lg italic text-gray-700">
                      {currentCardData.example}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {currentCardData.exampleTranslation}
                    </p>
                  </div>
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
              className="flex-1 max-w-40 border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Не знаю
            </Button>
            <Button
              onClick={handleKnown}
              className="flex-1 max-w-40 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Знаю
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            onClick={prevCard}
            color="outline"
            disabled={currentCard === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>

          <Button
            onClick={handleFlip}
            color="outline"
            className="gap-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Перевернуть
          </Button>

          <Button
            onClick={nextCard}
            color="outline"
            disabled={currentCard === flashcards.length - 1}
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

      {/*<style jsx>{`
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
      `}</style>*/}
    </div>
  );
}
