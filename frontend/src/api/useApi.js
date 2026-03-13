import axios from "axios";
import { useAuth } from "@/context/AuthContext.jsx";

export function useApi() {
  const { accessToken, refresh, logout } = useAuth();
  const api = axios.create({
    baseURL: "https://localhost:5000/api",
  });
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.header.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const newToken = await refresh();
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          logout();
        }
      }
      return Promise.reject(error);
    },
  );
  return api;
}
