import SettingsSection from "@/app/settings/settingsBlock";
import { Mail } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useState } from "react";
import { useAlertStore } from "@/states/alertStore";
import { useTranslations } from "next-intl";

export default function Email() {
  const { addAlert } = useAlertStore();
  const [inputtedEmail, setInputtedEmail] = useState("");
  function fetchData() {
    const url = "https://learn-english-6ufl.onrender.com/api/email/send-email";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ email: inputtedEmail }),
    }).then(async (response) => {
      const contentType = response.headers.get("Content-Type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = {};
      }

      if (!response.ok) {
        addAlert(`Error: ${data.message || response.statusText}`, "error");
        throw new Error(data.message || "Server Error");
      }
      addAlert("Email sent successfully.", "success");
    });
  }
  const t = useTranslations();
  return (
    <SettingsSection
      title={t("emailConfirmation")}
      subTitle={t("email")}
      icon={<Mail />}
    >
      <div className="mb-2">
        <div className="font-medium">{t("email")}</div>
        <div className="relative w-full flex flex-row gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={inputtedEmail}
            onChange={(e) => setInputtedEmail(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 pr-10"
          />
          <Button
            className="flex flex-row gap-2"
            color="outline"
            onClick={() => fetchData()}
          >
            <Mail />
            {t("confirmEmail")}
          </Button>
        </div>
        <p className="text-gray-400 my-2">{t("confirmationNote")}</p>
        <div className="bg-green-300 p-2 rounded-md text-center">
          {t("emailConfirmed")}
        </div>
      </div>
    </SettingsSection>
  );
}
