"use client";
import SettingsSection from "@/app/settings/settingsBlock";
import { Globe } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useEffect, useState } from "react";
import { useUserSettingsStore } from "@/states/requests/useUserSettings";
import AddSelectLanguageBlock from "@/app/settings/AddSelectLanguageBlock";
import axios from "axios";

export default function Settings() {
  const INTERFACE_LANGUAGES = [
    {
      code: "UA",
      label: "Українська",
    },
    {
      code: "EN",
      label: "English",
    },
    {
      code: "DE",
      label: "Deutsch",
    },
  ];
  const STUDY_LANGUAGES = [
    {
      code: "EN",
      label: "English",
    },
    {
      code: "DE",
      label: "Deutsch",
    },
  ];
  const { settings, fetchSettings } = useUserSettingsStore();

  const [selectedInterfaceLanguage, setSelectedInterfaceLanguage] =
    useState<string>(settings.global_language);
  const [selectedStudyLanguage, setSelectedStudyLanguage] = useState(
    settings.current_language,
  );

  useEffect(() => {
    setSelectedInterfaceLanguage(settings.global_language);
    setSelectedStudyLanguage(settings.current_language);
  }, [settings]);

  const handleSave = async () => {
    try {
      const updatedSettings = {
        global_language: selectedInterfaceLanguage,
        current_language: selectedStudyLanguage,
        purposes: settings.purposes,
        current_level: settings.current_level,
      };

      const response = await axios.patch(
        "https://learn-english-6ufl.onrender.com/api/settings",
        updatedSettings,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      // Тут можна додати обробку успішного збереження
      console.log("Налаштування збережено:", response.data);
      fetchSettings();
    } catch (error) {
      console.error("Помилка при збереженні налаштувань:", error);
    } finally {
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto p-4">
      <SettingsSection
        title="Налаштування профілю"
        icon={<Globe />}
        subTitle="Налаштуйте мови інтерфейсу та навчання відповідно до ваших потреб"
      >
        <AddSelectLanguageBlock
          title="Мова інтерфейсу"
          icon={<Globe />}
          selectedLanguage={selectedInterfaceLanguage}
          LANGUAGES={INTERFACE_LANGUAGES}
          onLanguageSelect={setSelectedInterfaceLanguage}
        />

        <AddSelectLanguageBlock
          title="Мова навчання"
          icon={<Globe />}
          selectedLanguage={selectedStudyLanguage}
          LANGUAGES={STUDY_LANGUAGES}
          onLanguageSelect={setSelectedStudyLanguage}
        />

        <Button onClick={handleSave}>Save</Button>
      </SettingsSection>
    </section>
  );
}
