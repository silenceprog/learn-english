"use client";
import SettingsSection from "@/app/settings/settingsBlock";
import { Globe } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/shared/ui/Button";
import Flag from "react-world-flags";
import { useEffect, useState } from "react";
import { useUserSettingsStore } from "@/states/requests/useUserSettings";

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
  const { settings } = useUserSettingsStore();

  const [selectedInterfaceLanguage, setSelectedInterfaceLanguage] =
    useState<string>(settings.global_language);
  const [selectedStudyLanguage, setSelectedStudyLanguage] = useState(
    settings.current_language,
  );

  useEffect(() => {
    setSelectedInterfaceLanguage(settings.global_language);
    setSelectedStudyLanguage(settings.current_language);
  }, [settings]);

  return (
    <section className="w-full max-w-2xl mx-auto p-4">
      <SettingsSection
        title="Налаштування профілю"
        icon={<Globe />}
        subTitle="Налаштуйте мови інтерфейсу та навчання відповідно до ваших потреб"
      >
        <div className="flex flex-row items-center">
          <Globe className="w-4 h-4 t mr-2" />
          <p className="font-semibold">Мова інтерфейсу</p>
        </div>
        <div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="w-full my-2">
              <Button color="outline" className="w-full cursor-pointer">
                <div className="flex flex-row items-center">
                  {selectedInterfaceLanguage === "EN" ? (
                    <Flag code="GB" className="w-5 h-5 mr-2" />
                  ) : (
                    <Flag
                      code={selectedInterfaceLanguage}
                      className="w-5 h-5 mr-2"
                    />
                  )}
                  <span>{selectedInterfaceLanguage}</span>
                </div>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-full z-50 bg-white p-1 shadow-md border-1-gray-200">
              {INTERFACE_LANGUAGES.map((lang, index) => (
                <DropdownMenu.Item
                  key={index}
                  className="text-sm px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                  onSelect={() => setSelectedInterfaceLanguage(lang)}
                >
                  <div className="flex flex-row">
                    {lang.code === "EN" ? (
                      <Flag code="GB" className="w-10 pr-2" />
                    ) : (
                      <Flag code={lang.code} className="w-10 pr-2" />
                    )}
                    {lang.label}
                  </div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <div className="flex flex-row items-center">
          <Globe className="w-4 h-4 t mr-2" />
          <p className="font-semibold">Мова навчання</p>
        </div>
        <div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="w-full my-2">
              <Button color="outline" className="w-full cursor-pointer">
                <div className="flex flex-row items-center">
                  {selectedStudyLanguage === "EN" ? (
                    <Flag code="GB" className="w-5 h-5 mr-2" />
                  ) : (
                    <Flag
                      code={selectedStudyLanguage}
                      className="w-5 h-5 mr-2"
                    />
                  )}
                  <span>{selectedStudyLanguage}</span>
                </div>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-full z-50 bg-white p-1 shadow-md border-1-gray-200">
              {STUDY_LANGUAGES.map((lang, index) => (
                <DropdownMenu.Item
                  key={index}
                  className="text-sm px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                  onSelect={() => setSelectedStudyLanguage(lang)}
                >
                  <div className="flex flex-row">
                    {lang.code === "EN" ? (
                      <Flag code="GB" className="w-10 pr-2" />
                    ) : (
                      <Flag code={lang.code} className="w-10 pr-2" />
                    )}
                    {lang.label}
                  </div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <Button>Save</Button>
      </SettingsSection>
    </section>
  );
}
