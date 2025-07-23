"use client";
import SettingsSection from "@/app/settings/settingsBlock";
import {
  BarChart,
  BookText,
  Circle,
  CircleDot,
  Globe,
  Languages,
  LineChart,
  LockKeyhole,
  Rocket,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useEffect, useState } from "react";
import { useUserSettingsStore } from "@/states/requests/useUserSettings";
import AddSelectLanguageBlock from "@/app/settings/AddSelectLanguageBlock";
import axios from "axios";
import Flag from "react-world-flags";
import { useAlertStore } from "@/states/alertStore";
import InputField from "@/app/settings/InputField";
import { useChangePassword } from "@/states/requests/useChangePassword";

export default function Settings() {
  const INTERFACE_LANGUAGES = [
    {
      icon: <Flag code="UA" className="w-5 h-5 mr-2" />,
      code: "UA",
      label: "Українська",
    },
    {
      icon: <Flag code="GB" className="w-5 h-5 mr-2" />,
      code: "EN",
      label: "English",
    },
    {
      icon: <Flag code="DE" className="w-5 h-5 mr-2" />,
      code: "DE",
      label: "Deutsch",
    },
  ];
  const STUDY_LANGUAGES = [
    {
      icon: <Flag code="GB" className="w-5 h-5 mr-2" />,
      code: "EN",
      label: "English",
    },
    {
      icon: <Flag code="DE" className="w-5 h-5 mr-2" />,
      code: "DE",
      label: "Deutsch",
    },
  ];

  const LEVELS_KNOWELEDGES = [
    {
      icon: <CircleDot className="w-5 h-5 mr-2" />,
      code: "A1",
      label: "Початковий (А1)",
    },
    {
      icon: <Circle className="w-5 h-5 mr-2" />,
      code: "A2",
      label: "Елементарний (A2)",
    },
    {
      icon: <BarChart className="w-5 h-5 mr-2" />,
      code: "B1",
      label: "Середній (B1)",
    },
    {
      icon: <LineChart className="w-5 h-5 mr-2" />,
      code: "B2",
      label: "Вище середнього (B2)",
    },
    {
      icon: <Rocket className="w-5 h-5 mr-2" />,
      code: "C1",
      label: "Просунутий (C1)",
    },
    {
      icon: <Trophy className="w-5 h-5 mr-2" />,
      code: "C2",
      label: "Вільне володіння (C2)",
    },
  ];

  const GOALS = [
    { label: "Для роботи/кар'єри", value: "WORK", icon: "💼" },
    { label: "Для подорожей", value: "TRAVEL", icon: "✈️" },
    { label: "Для навчання/освіти", value: "EDUCATION", icon: "📚" },
    { label: "Для особистого розвитку", value: "SELF_DEV", icon: "🌱" },
    {
      label: "Для спілкування з друзями/родиною",
      value: "COMMUNICATION",
      icon: "🧑‍🤝‍🧑",
    },
    { label: "Як хобі", value: "HOBBY", icon: "🎨" },
  ];

  const { settings, fetchSettings } = useUserSettingsStore();
  const { addAlert } = useAlertStore();

  const [selectedInterfaceLanguage, setSelectedInterfaceLanguage] =
    useState<string>(settings.global_language);
  const [selectedStudyLanguage, setSelectedStudyLanguage] = useState(
    settings.current_language,
  );
  const [selectedCurrentLevel, setSelectedCurrentLevel] = useState(
    settings.current_level,
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    settings.purposes,
  );

  useEffect(() => {
    setSelectedInterfaceLanguage(settings.global_language);
    setSelectedStudyLanguage(settings.current_language);
    setSelectedCurrentLevel(settings.current_level);
    setSelectedGoals(settings.purposes);
  }, [settings]);

  const handleSave = async () => {
    try {
      const updatedSettings = {
        global_language: selectedInterfaceLanguage,
        current_language: selectedStudyLanguage,
        purposes: selectedGoals,
        current_level: selectedCurrentLevel,
      };

      const response = await axios.patch(
        "https://learn-english-6ufl.onrender.com/api/settings",
        updatedSettings,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      // Тут можна додати обробку успішного збереження
      console.log("Налаштування збережено:", response.data);
      fetchSettings();
      addAlert("Налаштування збережено", "success");
    } catch (error) {
      console.log(selectedGoals);
      console.error("Помилка при збереженні налаштувань:", error);
    } finally {
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((i) => i !== goal) : [...prev, goal],
    );
  };
  const { fetch } = useChangePassword();
  return (
    <section className="w-full max-w-2xl mx-auto p-4">
      <SettingsSection
        title="Налаштування профілю"
        icon={<Globe />}
        subTitle="Налаштуйте мови інтерфейсу та навчання відповідно до ваших потреб"
      >
        <AddSelectLanguageBlock
          title="Мова інтерфейсу"
          icon={<Globe />}
          selectedLanguage={selectedInterfaceLanguage}
          LANGUAGES={INTERFACE_LANGUAGES}
          onLanguageSelect={setSelectedInterfaceLanguage}
          whatIsIt="Мова, якою відображатиметься інтерфейс додатку"
        />

        <AddSelectLanguageBlock
          title="Мова навчання"
          icon={<Languages />}
          selectedLanguage={selectedStudyLanguage}
          LANGUAGES={STUDY_LANGUAGES}
          onLanguageSelect={setSelectedStudyLanguage}
          whatIsIt="Мова, яку ви хочете вивчати або вдосконалювати"
        />

        <div>
          <div className="flex flex-row items-center">
            <Target className="w-4 h-4 mr-2" />
            <p className="font-semibold">Мета вивчення мови</p>
          </div>
          <div className="space-y-2">
            {GOALS.map((goal) => (
              <label
                key={goal.label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedGoals.includes(goal.value)}
                  onChange={() => toggleGoal(goal.value)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span>{goal.icon}</span>
                <span>{goal.label}</span>
              </label>
            ))}
          </div>
          <div className="text-gray-400 font-extralight">
            Оберіть одну або декілька цілей для персоналізації навчання
          </div>
        </div>

        <AddSelectLanguageBlock
          title="Поточний рівень знань"
          icon={<BookText />}
          selectedLanguage={selectedCurrentLevel}
          LANGUAGES={LEVELS_KNOWELEDGES}
          onLanguageSelect={setSelectedCurrentLevel}
          whatIsIt="Оцініть свій поточний рівень володіння мовою"
        />
        <div className="pt-6 border-t-1"></div>
        <div className="flex flex-row items-center justify-end">
          <Button onClick={handleSave} color="outline">
            Save
          </Button>
        </div>
      </SettingsSection>
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
          Змінити
        </Button>
      </SettingsSection>
    </section>
  );
}
