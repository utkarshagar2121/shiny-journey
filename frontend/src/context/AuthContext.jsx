import { useState, useEffect, useRef, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef(null); // ← always holds latest token
  const navigate = useNavigate();

  // keep ref in sync with state
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    const tryRestore = async () => {
      const storedRefresh = localStorage.getItem("refreshToken");
      if (!storedRefresh) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.post("/auth/refresh", {
          refreshToken: storedRefresh,
        });
        setAccessToken(res.data.accessToken);
        tokenRef.current = res.data.accessToken; // ← set immediately, don't wait for effect
        setUser(res.data.user);
      } catch {
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
    tokenRef.current = accessToken; // ← set immediately
    setUser(user);
    setLoading(false);
    localStorage.setItem("refreshToken", refreshToken);
    navigate("/dashboard");
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
    await login(email, password);
  };

  const logout = async () => {
    try {
      const storedRefresh = localStorage.getItem("refreshToken");
      if (storedRefresh)
        await api.post("/auth/logout", { refreshToken: storedRefresh });
    } catch { /* empty */ } finally {
      setAccessToken(null);
      tokenRef.current = null;
      setUser(null);
      setLoading(false);
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
    tokenRef.current = res.data.accessToken; // ← set immediately
    setUser(res.data.user);
    return res.data.accessToken;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        tokenRef,
        loading,
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
