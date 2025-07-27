"use client";
import LanguagesAndExperience from "@/app/settings/LanguagesAndExperience";
import Password from "@/app/settings/Password";

export default function Settings() {
  return (
    <section className="w-full max-w-2xl mx-auto">
      <LanguagesAndExperience />
      <Password />
    </section>
  );
}
