import {
  BarChart,
  BookText,
  Circle,
  CircleDot,
  Globe,
  Languages,
  LineChart,
  Rocket,
  Target,
  Trophy,
} from "lucide-react";
import AddSelectLanguageBlock from "@/app/settings/AddSelectLanguageBlock";
import { Button } from "@/shared/ui/Button";
import SettingsSection from "@/app/settings/settingsBlock";
import axios from "axios";
import { useUserSettingsStore } from "@/states/requests/useUserSettings";
import { useAlertStore } from "@/states/alertStore";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";
import { useTranslations } from "next-intl";

export default function LanguagesAndExperience() {
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
  const t = useTranslations();

  const LEVELS_KNOWELEDGES = [
    {
      icon: <CircleDot className="w-5 h-5 mr-2" />,
      code: "A1",
      label: t("level_A1"),
    },
    {
      icon: <Circle className="w-5 h-5 mr-2" />,
      code: "A2",
      label: t("level_A2"),
    },
    {
      icon: <BarChart className="w-5 h-5 mr-2" />,
      code: "B1",
      label: t("level_B1"),
    },
    {
      icon: <LineChart className="w-5 h-5 mr-2" />,
      code: "B2",
      label: t("level_B2"),
    },
    {
      icon: <Rocket className="w-5 h-5 mr-2" />,
      code: "C1",
      label: t("level_C1"),
    },
    {
      icon: <Trophy className="w-5 h-5 mr-2" />,
      code: "C2",
      label: t("level_C2"),
    },
  ];
  const GOALS = [
    { label: t("goal_work"), value: "WORK", icon: "💼" },
    { label: t("goal_travel"), value: "TRAVEL", icon: "✈️" },
    { label: t("goal_study"), value: "EDUCATION", icon: "📚" },
    { label: t("goal_growth"), value: "SELF_DEV", icon: "🌱" },
    {
      label: t("goal_communication"),
      value: "COMMUNICATION",
      icon: "🧑‍🤝‍🧑",
    },
    { label: t("goal_hobby"), value: "HOBBY", icon: "🎨" },
  ];
  const { settings, fetchSettings } = useUserSettingsStore();
  useEffect(() => {
    setSelectedInterfaceLanguage(settings.global_language);
    setSelectedStudyLanguage(settings.current_language);
    setSelectedCurrentLevel(settings.current_level);
    setSelectedGoals(settings.purposes);
  }, [settings]);

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
  return (
    <SettingsSection
      title={t("profileSettings")}
      icon={<Globe />}
      subTitle={t("profileSettingsDescription")}
    >
      <AddSelectLanguageBlock
        title={t("interfaceLanguage")}
        icon={<Globe />}
        selectedLanguage={selectedInterfaceLanguage}
        LANGUAGES={INTERFACE_LANGUAGES}
        onLanguageSelect={setSelectedInterfaceLanguage}
        whatIsIt={t("interfaceLanguageDescription")}
      />

      <AddSelectLanguageBlock
        title={t("learningLanguage")}
        icon={<Languages />}
        selectedLanguage={selectedStudyLanguage}
        LANGUAGES={STUDY_LANGUAGES}
        onLanguageSelect={setSelectedStudyLanguage}
        whatIsIt={t("learningLanguageDescription")}
      />

      <div>
        <div className="flex flex-row items-center">
          <Target className="w-4 h-4 mr-2" />
          <p className="font-semibold">{t("learningGoal")}</p>
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
        <div className="text-gray-400 font-extralight">{t("chooseGoals")}</div>
      </div>

      <AddSelectLanguageBlock
        title={t("currentLevel")}
        icon={<BookText />}
        selectedLanguage={selectedCurrentLevel}
        LANGUAGES={LEVELS_KNOWELEDGES}
        onLanguageSelect={setSelectedCurrentLevel}
        whatIsIt={t("levelAssessment")}
      />
      <div className="pt-6 border-t-1"></div>
      <div className="flex flex-row items-center justify-end">
        <Button onClick={handleSave} color="outline">
          {t("save")}
        </Button>
      </div>
    </SettingsSection>
  );
}
