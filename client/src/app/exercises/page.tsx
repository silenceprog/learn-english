"use client";
import { Section } from "@/shared/ui/Section";
import CreateExercise from "@/app/exercises/CreateExercise";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetFlashcards } from "@/states/requests/useGetFlashcards";

export default function Exercises() {
  const { flashcards, fetch } = useGetFlashcards();
  const router = useRouter();

  return (
    <Section>
      <p className="text-2xl font-bold text-blue-700 md:text-4xl mb-4">
        Вправи зі словами
      </p>
      <div className="grid grid-cols-3 gap-6">
        <CreateExercise
          name="Cards"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
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
          name="Reverse Cards"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
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
          name="Matching Cards"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
          href="/exercises/reverseFlashCards"
          difficulty="Hard"
          handleClick={async () => {
            await fetch();
            if (flashcards.length >= 10) {
              router.push("/exercises/matching");
            }
          }}
        />
      </div>
    </Section>
  );
}
