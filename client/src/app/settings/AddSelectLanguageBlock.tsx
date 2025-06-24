import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Flag from "react-world-flags";
import { ReactNode } from "react";

interface AddSelectLanguageBlockProps {
  title: string;
  selectedLanguage: string;
  icon: ReactNode;
  LANGUAGES: { code: string; label: string }[];
  onLanguageSelect: (lang: string) => void;
}

export default function AddSelectLanguageBlock({
  title,
  selectedLanguage,
  icon,
  LANGUAGES,
  onLanguageSelect,
}: AddSelectLanguageBlockProps) {
  return (
    <section className="py-2">
      <div className="flex flex-row items-center">
        <div className="w-4 h-4 mr-2">{icon}</div>
        <p className="font-semibold">{title}</p>
      </div>
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full my-2 outline-1 py-2 px-4 hover:bg-gray-200 text-gray-900 border border-gray-200 rounded-md">
            <div className="flex flex-row items-center">
              {selectedLanguage === "EN" ? (
                <Flag code="GB" className="w-5 h-5 mr-2" />
              ) : (
                <Flag code={selectedLanguage} className="w-5 h-5 mr-2" />
              )}
              <span>{selectedLanguage}</span>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="min-w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1 shadow-md border border-gray-200 rounded-b-md">
            {LANGUAGES.map((lang) => (
              <DropdownMenu.Item
                key={lang.code}
                className="w-full text-sm px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                onSelect={() => onLanguageSelect(lang.code)}
                asChild
              >
                <div className="flex flex-row w-full">
                  <Flag
                    code={lang.code === "EN" ? "GB" : lang.code}
                    className="w-10 pr-2"
                  />
                  {lang.label}
                </div>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </section>
  );
}
