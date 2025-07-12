"use client";
import { useState } from "react";
import { Button } from "@/shared/ui/Button";

export function CopyToken() {
  const [status, setStatus] = useState<"copied" | "not_found" | false>(false);

  const handleCopy = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setStatus("not_found");
      setTimeout(() => setStatus(false), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(token);
      setStatus("copied");
      setTimeout(() => setStatus(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };
  return (
    <Button
      onClick={handleCopy}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
    >
      {status === "not_found"
        ? "Token not found ❌"
        : status === "copied"
          ? "Copied ✅"
          : "Copy access token"}
    </Button>
  );
}
