"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type User = {
  _id: string
  email: string
  screenName: string
  fullName: string
  country: string
  dob: string
  city: string
  targetsLeft: number
  lastActive: string
  phoneNumber: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (userData: User, accessToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const login = (userData: User, accessToken: string) => {
    setUser(userData)
    setToken(accessToken)

    // Save in localStorage (optional but good)
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
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
