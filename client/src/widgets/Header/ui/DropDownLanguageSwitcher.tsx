import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/shared/ui/Button";
import { FaEarthAfrica } from "react-icons/fa6";

export function DropDownLanguageSwitcher() {
  const LANGUAGES = [
    { code: "ua", label: "Український" },
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button color="white">
          <FaEarthAfrica className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="center"
        className="z-50 min-w-[8rem] bg-white p-1 shadow-md border-1-gray-200"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenu.Item
            key={lang.code}
            className="text-sm px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
            // onSelect={() => {}}
          >
            {lang.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
