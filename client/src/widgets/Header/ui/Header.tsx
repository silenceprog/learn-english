import { Section } from "@/shared/ui/Section";
import { IoEnterOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import { DropDownLanguageSwitcher } from "@/widgets/Header/ui/DropDownLanguageSwitcher";
import { Button } from "@/shared/ui/Button";

export function Header() {
  return (
    <Section className="border-b border-gray-200 sticky top-0 z-50 w-full bg-white">
      <div className="flex justify-between h-16 items-center px-4">
        <Link href="#" className="text-2xl font-bold text-blue-600">
          LinguaLearn
        </Link>

        {/*Desktop navigation*/}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            Курси
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            Практика
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            Словарь
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            Спільнота
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <DropDownLanguageSwitcher />
          <Button color="white">
            <IoEnterOutline className="w-5 h-5" />
          </Button>
          <Link href="/registration">
            <Button
              className="flex justify-center items-center border cursor-pointer"
              color="outline"
            >
              <CiUser className="h-5 w-5 mr-1" />
              Регістрація
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
