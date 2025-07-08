"use client";
import { MyWordsBlock } from "@/app/MyWordsBlock";
import { Section } from "@/shared/ui/Section";

export default function Home() {
  return (
    <>
      <Section>
        <MyWordsBlock />
      </Section>
    </>
  );
}
