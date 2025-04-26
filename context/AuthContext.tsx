// context/AuthContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true) // 🆕

  useEffect(() => {
    // Load from localStorage on initial render
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
    }

    setIsLoading(false) // ✅ Done loading
  }, [])

  const login = (userData: any, accessToken: string) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", accessToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
