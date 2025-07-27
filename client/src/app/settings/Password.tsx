import { LockKeyhole } from "lucide-react";
import InputField from "@/app/settings/InputField";
import { Button } from "@/shared/ui/Button";
import SettingsSection from "@/app/settings/settingsBlock";
import { useChangePassword } from "@/states/requests/useChangePassword";

export default function Password() {
  const { fetch } = useChangePassword();
  return (
    <SettingsSection
      title="Безпека акаунту"
      icon={<LockKeyhole />}
      subTitle="Змініть пароль та підтвердіть електронну пошту"
    >
      <p className="text-lg font-medium mb-2">Зміна паролю</p>
      <InputField
        title="Поточний пароль"
        placeholder="Введіть поточний пароль"
        oldPassword={true}
      />
      <InputField
        title="Новий пароль"
        placeholder="Введіть новий пароль"
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
        Змінити пароль
      </Button>
    </SettingsSection>
  );
}
