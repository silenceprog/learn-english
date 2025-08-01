import { useAuthStore } from "@/states/authStore";

export async function secureFetch(input: RequestInfo, init: RequestInit = {}) {
  const { refresh } = useAuthStore.getState();

  const baseHeaders = {
    ...init.headers,
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
  };

  let res = await fetch(input, { ...init, headers: baseHeaders });

  if (res.status === 401) {
    const newToken = await refresh();
    if (!newToken) throw new Error("Session expired");

    const retryHeaders = {
      ...init.headers,
      Authorization: `Bearer ${newToken}`,
      "Content-Type": "application/json",
    };

    res = await fetch(input, { ...init, headers: retryHeaders });
  }

  return res;
}
