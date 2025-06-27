import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactElement, ReactNode } from "react";

interface AddSelectLanguageBlockProps {
  title: string;
  selectedLanguage: string;
  icon: ReactNode;
  LANGUAGES: { icon: ReactElement; code: string; label: string }[];
  onLanguageSelect: (lang: string) => void;
  whatIsIt: string;
}

export default function AddSelectLanguageBlock({
  title,
  selectedLanguage,
  icon,
  LANGUAGES,
  onLanguageSelect,
  whatIsIt,
}: AddSelectLanguageBlockProps) {
  const selectedLang = LANGUAGES.find((lang) => lang.code === selectedLanguage);
  return (
    <section className="py-2">
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-center w-4 h-4 mr-1">
          {icon}
        </div>
        <p className="font-semibold">{title}</p>
      </div>
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="w-full my-2 outline-1 py-2 px-4 hover:bg-gray-200 text-gray-900 border border-gray-200 rounded-md">
            <div className="flex flex-row items-center">
              {selectedLang?.icon}
              <span>{selectedLanguage}</span>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="min-w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1 shadow-md border border-gray-200 rounded-b-md">
            {LANGUAGES.map((lang) => (
              <DropdownMenu.Item
                key={lang.label}
                className="w-full text-sm px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                onSelect={() => onLanguageSelect(lang.code)}
                asChild
              >
                <div className="flex flex-row w-full">
                  {lang.icon}
                  {lang.label}
                </div>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="text-gray-400 font-extralight">{whatIsIt}</div>
    </section>
  );
}
