"use client";
import { Section } from "@/shared/ui/Section";
import { IoEnterOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import { DropDownLanguageSwitcher } from "@/widgets/Header/ui/DropDownLanguageSwitcher";
import { Button } from "@/shared/ui/Button";
import { useEffect, useState } from "react";
import { DropDownUserAccount } from "@/widgets/Header/ui/DropDownUserAccount";
import { DropDownUserMenu } from "@/widgets/Header/ui/DropDownUserMenu";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  function isTokenValid(token: string): boolean {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp > currentTime;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && isTokenValid(token)) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

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
            Practice
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            Dictionary
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            Community
          </Link>
        </nav>
        {isLoggedIn ? (
          <div>
            <DropDownLanguageSwitcher />
            <DropDownUserAccount />
            <DropDownUserMenu />
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button color="white">
                <IoEnterOutline className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/registration">
              <Button
                className="flex justify-center items-center border cursor-pointer"
                color="outline"
              >
                <CiUser className="h-5 w-5 mr-1" />
                Registration
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Section>
  );
}
