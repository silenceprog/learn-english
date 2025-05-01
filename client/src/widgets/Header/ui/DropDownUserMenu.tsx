import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/shared/ui/Button";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";

export function DropDownUserMenu() {
  const logout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/"; // або "/" — залежно від логіки
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button color="white">
          <RxHamburgerMenu className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="center"
        className="z-50 min-w-[8rem] bg-white p-1 shadow-md border-1-gray-200"
      >
        <DropdownMenu.Item
          className="text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-100 text-gray-700"
          // onSelect={() => {}}
        >
          <Link href="/admin-panel">AdminPanel</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="text-sm px-2 py-1.5 cursor-pointer hover:bg-gray-100 text-gray-700"
          // onSelect={() => {}}
        >
          <p onClick={logout}>LogOut</p>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
