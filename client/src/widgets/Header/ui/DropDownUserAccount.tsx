import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/shared/ui/Button";
import { CiUser } from "react-icons/ci";

export function DropDownUserAccount() {
  const LANGUAGES = [{ title: "Settings" }];
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button color="white">
          <CiUser className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="center"
        className="z-50 min-w-[8rem] bg-white p-1 shadow-md border-1-gray-200"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenu.Item
            key={lang.title}
            className="text-sm px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
            // onSelect={() => {}}
          >
            {lang.title}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
