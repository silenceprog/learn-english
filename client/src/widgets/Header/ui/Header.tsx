"use client";
import { Section } from "@/shared/ui/Section";
import { IoEnterOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import { DropDownLanguageSwitcher } from "@/widgets/Header/ui/DropDownLanguageSwitcher";
import { Button } from "@/shared/ui/Button";
import { useEffect } from "react";
import { DropDownUserAccount } from "@/widgets/Header/ui/DropDownUserAccount";
import { DropDownUserMenu } from "@/widgets/Header/ui/DropDownUserMenu";
import { useUserSettingsStore } from "@/states/requests/useUserSettings";
import { CopyToken } from "@/widgets/Token/CopyToken";
import { useAuthStore } from "@/states/authStore";
import { useTranslations } from "next-intl";
import { useLocaleStore } from "@/states/useLocaleStore";

export function Header() {
  const { isAuthenticated } = useAuthStore();
  const { fetchSettings, settings } = useUserSettingsStore();
  const { setLocale } = useLocaleStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
      setLocale(settings.global_language);
    }
  }, [isAuthenticated]);
  const t = useTranslations();
  return (
    <Section className="border-b border-gray-200 sticky top-0 z-50 w-full bg-white">
      <div className="flex justify-between h-16 items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          LinguaLearn
        </Link>
        <CopyToken />

        {/*Desktop navigation*/}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            {t("courses")}
          </Link>
          <Link
            href="/exercises"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            {t("exercises")}
          </Link>
          <Link
            href="/dictionary"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            {t("dictionary")}
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            {t("community")}
          </Link>
        </nav>
        <div className="flex">
          <DropDownLanguageSwitcher />
          {isAuthenticated ? (
            <div>
              <DropDownUserAccount />
              <DropDownUserMenu />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button
                  color="outline"
                  className="flex justify-center items-center border cursor-pointer"
                >
                  <IoEnterOutline className="w-5 h-5 mr-1" />
                  {t("login")}
                </Button>
              </Link>
              <Link href="/registration">
                <Button
                  className="flex justify-center items-center border cursor-pointer"
                  color="outline"
                >
                  <CiUser className="h-5 w-5 mr-1" />
                  {t("registration")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
