"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { Loader2 } from "lucide-react";
import { useAlertStore } from "@/states/alertStore";
import { useAuthStore } from "@/states/authStore";

export default function Login() {
  const { addAlert } = useAlertStore();
  const { setAccessToken } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const data = await response.json();
      setAccessToken(data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      if (!response.ok) {
        addAlert(data.message || "Login error", "error");
        return;
      }
      addAlert("Login success", "success");

      // Redirect to main page
      router.push("/");
    } catch (error) {
      if (typeof error === "string") {
        addAlert(error, "error");
      } else {
        addAlert("Something went wrong. Please try again later.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Вхід</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <Button type="submit" className="w-full text-white cursor-pointer">
          <div className="flex flex-row justify-center items-center">
            Увійти
            {isLoading ? <Loader2 className="animate-spin h-5 w-5 ml-2" /> : ""}
          </div>
        </Button>
      </form>
    </div>
  );
}
