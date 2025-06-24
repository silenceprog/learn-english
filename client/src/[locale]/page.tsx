// app/[locale]/page.tsx
import { useTranslation } from "next-i18next";

export default function HomePage() {
  const { t } = useTranslation("common");

  return <h1>{t("courses")}</h1>;
}
