"use client";
import CreateFlashcardsExercise from "@/app/exercises/flashcards/CreateFlashcardsExercise";
import { useGetFlashcards } from "@/states/requests/useGetFlashcards";

export default function ReverseCards() {
  const { flashcards } = useGetFlashcards();
  return (
    <CreateFlashcardsExercise
      flashcards={flashcards}
      reverse={true}
      skillType="REVERSE_FLASHCARDS"
    />
  );
}
