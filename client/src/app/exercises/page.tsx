"use client";
import { Section } from "@/shared/ui/Section";
import CreateExercise from "@/app/exercises/CreateExercise";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetFlashcards } from "@/states/requests/useGetFlashcards";
import { useTranslations } from "next-intl";

export default function Exercises() {
  const { flashcards, fetch } = useGetFlashcards();
  const router = useRouter();
  const t = useTranslations();
  return (
    <Section>
      <p className="text-2xl font-bold text-blue-700 md:text-4xl mb-4">
        Вправи зі словами
      </p>
      <div className="grid grid-cols-3 gap-6">
        <CreateExercise
          name={t("cards")}
          icon={<BookOpen />}
          text={t("cardsDescription")}
          href="/exercises/flashcards"
          difficulty="Easy"
          handleClick={async () => {
            await fetch();
            if (flashcards.length >= 10) {
              router.push("/exercises/flashcards");
            }
          }}
        />
        <CreateExercise
          name={t("reverseCards")}
          icon={<BookOpen />}
          text={t("reverseCardsDescription")}
          href="/exercises/reverseFlashCards"
          difficulty="Hard"
          handleClick={async () => {
            await fetch();
            if (flashcards.length >= 10) {
              router.push("/exercises/reverseFlashCards");
            }
          }}
        />
        <CreateExercise
          name={t("matching")}
          icon={<BookOpen />}
          text={t("matchingDescription")}
          href="/exercises/reverseFlashCards"
          difficulty="Hard"
          handleClick={() => router.push("/exercises/matching")}
        />
      </div>
    </Section>
  );
}
