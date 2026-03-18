import axios from "axios";
import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { tokenRef, refresh, logout } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // eslint-disable-next-line react-hooks/refs
  api.interceptors.request.use((config) => {
    if (tokenRef.current) {
      config.headers.Authorization = `Bearer ${tokenRef.current}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      const isMultipart = original.headers?.["Content-Type"]?.includes(
        "multipart/form-data",
      );
      if (error.response?.status === 401 && !original._retry && !isMultipart) {
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
