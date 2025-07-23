"use client";
import { useAlertStore } from "@/states/alertStore";

export default function Alerts() {
  const alerts = useAlertStore((state) => state.alerts);
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`px-4 py-2 rounded shadow text-white transition-all duration-300 ${alert.type === "success" ? "bg-green-500" : alert.type === "error" ? "bg-red-500" : "bg-blue-500"}`}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
}
