import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const { Clerk } = await import("@clerk/nextjs");
    const token = await Clerk.session?.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
