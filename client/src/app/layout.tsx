"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/widgets/Header/ui/Header";
import AddNewWord from "@/modals/addNewWord";
import Alerts from "@/shared/ui/Alerts";
import DeleteWordModal from "@/modals/deleteWordModal";
import { useLocaleStore } from "@/states/useLocaleStore";
import { ReactNode, useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function loadMessages(locale: string) {
  switch (locale) {
    case "ua":
      return (await import("../locales/ua.json")).default;
    case "de":
      return (await import("../locales/de.json")).default;
    case "en":
    default:
      return (await import("../locales/en.json")).default;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = "en";
  return (
    <html lang={locale}>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageLoader>
          <Header />
          <AddNewWord />
          <DeleteWordModal />
          <Alerts />
          {children}
        </LanguageLoader>
      </body>
    </html>
  );
}

function LanguageLoader({ children }: { children: ReactNode }) {
  const locale = useLocaleStore((state) => state.locale) || "en";
  const [messages, setMessages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    loadMessages(locale).then(setMessages);
  }, [locale]);

  if (!messages) return <div>Loading translations...</div>;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
