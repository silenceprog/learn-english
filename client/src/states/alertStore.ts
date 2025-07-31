import { create } from "zustand/react";
import { v4 as uuidv4 } from "uuid";

type AlertType = "info" | "success" | "error";

interface Alert {
  id: string;
  message: string;
  type: AlertType;
}
interface AlertStore {
  alerts: Alert[];
  addAlert: (message: string, type?: AlertType) => void;
  removeAlert: (id: string) => void;
}
export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (message, type = "info") => {
    const id = uuidv4();
    const newAlert = { id, message, type };

    set((state) => ({
      alerts: [newAlert, ...state.alerts],
    }));

    setTimeout(() => {
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id),
      }));
    }, 5000);
  },
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
}));
