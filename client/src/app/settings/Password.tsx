import { LockKeyhole } from "lucide-react";
import InputField from "@/app/settings/InputField";
import { Button } from "@/shared/ui/Button";
import SettingsSection from "@/app/settings/settingsBlock";
import { useChangePassword } from "@/states/requests/useChangePassword";
import { useTranslations } from "next-intl";

export default function Password() {
  const { fetch } = useChangePassword();
  const t = useTranslations();
  return (
    <SettingsSection
      title={t("accountSecurity")}
      icon={<LockKeyhole />}
      subTitle={t("changePasswordDescription")}
    >
      <p className="text-lg font-medium mb-2">{t("changePassword")}</p>
      <InputField
        title={t("currentPassword")}
        placeholder="Введіть поточний пароль"
        oldPassword={true}
      />
      <InputField
        title={t("newPassword")}
        placeholder={t("enterNewPassword")}
        newPassword={true}
      />
      <Button
        className="w-full flex flex-row items-center justify-center gap-2"
        color="outline"
        onClick={() => {
          fetch();
        }}
      >
        <LockKeyhole />
        {t("updatePassword")}
      </Button>
    </SettingsSection>
  );
}
