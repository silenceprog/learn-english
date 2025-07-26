import { Section } from "@/shared/ui/Section";
import CreateExercise from "@/app/exercises/CreateExercise";
import { BookOpen } from "lucide-react";

export default function Exercises() {
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
        />
        <CreateExercise
          name="Reverse Cards"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
          href="/exercises/flashcards"
          difficulty="Hard"
        />
        <CreateExercise
          name="Match"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
          href="/exercises/flashcards"
          difficulty="Hard"
        />
        <CreateExercise
          name="Choose right answer"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
          href="/exercises/flashcards"
          difficulty="Hard"
        />
        <CreateExercise
          name="To write word"
          icon={<BookOpen />}
          text="Изучайте новые слова с помощью интерактивных карточек"
          href="/exercises/flashcards"
          difficulty="Hard"
        />
      </div>
    </Section>
  );
}
