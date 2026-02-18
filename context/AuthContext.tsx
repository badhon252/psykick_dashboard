// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 🆕

  useEffect(() => {
    // Load from localStorage on initial render
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);

      // Ensure cookie is set for middleware
      if (!document.cookie.includes("token=")) {
        document.cookie = `token=${savedToken}; path=/; max-age=86400; SameSite=Lax`;
      }
    }

    setIsLoading(false); // ✅ Done loading
  }, []);

  const login = (userData: any, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);

    // Set cookie for middleware
    document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Remove cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
