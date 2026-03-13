import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";
import api from "@/api/axios";

const authContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const tryRestore = async () => {
      const storedRefresh = localStorage.getItem("refreshToken");
      console.log("tryRestore running, token:", storedRefresh);
      if (!storedRefresh) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.post("/auth/refresh", {
          refreshToken: storedRefresh,
        });
        // console.log("refresh response:", res.data);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch (err) {
        // console.log("refresh failed:", err.response?.data || err.message);
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };
    tryRestore();
  }, []);
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = res.data;
    setAccessToken(accessToken);
    setUser(user);
    setLoading(false);
    localStorage.setItem("refreshToken", refreshToken);
    navigate("/dashboard");
  };
  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    await login(email, password);
  };
  const logout = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        await api.post("/auth/logout", { refreshToken: storedRefreshToken });
      }
    } catch {
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("refreshToken");
      navigate("/auth");
    }
  };
  const refresh = async () => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) throw new Error("No refresh token");
    const res = await api.post("/auth/refresh", {
      refreshToken: storedRefresh,
    });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.accessToken;
  };
  return (
    <authContext.Provider
      value={{ user, accessToken, loading, login, signup, logout, refresh }}
    >
      {children}
    </authContext.Provider>
  );
}
export function useAuth() {
  return useContext(authContext);
}
