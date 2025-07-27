import { create } from "zustand/react";
import { useAlertStore } from "@/states/alertStore";

type ChangePassword = {
  oldPassword: string;
  newPassword: string;
  setOldPassword: (newPassword: string) => void;
  setNewPassword: (newPassword: string) => void;
  fetch: () => Promise<void>;
};
const { addAlert } = useAlertStore.getState();
export const useChangePassword = create<ChangePassword>((set, get) => ({
  oldPassword: "",
  newPassword: "",
  setOldPassword: (value: string) => set({ oldPassword: value }),
  setNewPassword: (value: string) => set({ newPassword: value }),
  fetch: async () => {
    const { oldPassword, newPassword } = get();
    const baseUrl =
      "https://learn-english-6ufl.onrender.com/api/email/change-password";
    if (oldPassword.length < 8 || newPassword.length < 8) {
      addAlert("Password must be longer than 8 characters!", "info");
      return;
    }
    try {
      const response = await fetch(baseUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        addAlert(
          `Помилка: ${errorData.message || "Сталася помилка на сервері"}`,
          "error",
        );
        return;
      }

      addAlert("Ви успішно змінили пароль", "success");
    } catch (error) {
      addAlert("Помилка з'єднання з сервером. Спробуйте пізніше.", "error");
      console.error(error);
    }
  },
}));
