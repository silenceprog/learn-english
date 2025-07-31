"use client";
import { Section } from "@/shared/ui/Section";
import CreateExercise from "@/app/exercises/CreateExercise";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetFlashcards } from "@/states/requests/useGetFlashcards";
import { useEffect, useState } from "react";

export default function Exercises() {
  const { data, fetch } = useGetFlashcards();
  const router = useRouter();
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (requested && data.length >= 10) {
      router.push("/exercises/flashcards");
    }
  }, [data, requested, router]);
  async function handleClick() {
    await fetch();
    setRequested(true);
  }
  function fetchCards2() {
    console.log("2");
  }

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
          handleClick={handleClick}
        />
        <CreateExercise
          name="Reverse Cards"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
          href="/exercises/flashcards"
          difficulty="Hard"
          handleClick={fetchCards2}
        />
      </div>
    </Section>
  );
}
