"use client";

import CreateFlashcardsExercise from "@/app/exercises/flashcards/CreateFlashcardsExercise";
import { useGetFlashcards } from "@/states/requests/useGetFlashcards";

export default function FlashCard() {
  const { flashcards } = useGetFlashcards();
  return (
    <CreateFlashcardsExercise flashcards={flashcards} skillType="FLASHCARDS" />
  );
}
