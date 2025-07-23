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
    try {
      const response = await fetch(baseUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        addAlert(`Помилка: ${errorData.message}`, "error");
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      addAlert("Ви успішно змінили пароль", "success");
    } catch (error) {
      console.error(error);
    }
  },
}));
