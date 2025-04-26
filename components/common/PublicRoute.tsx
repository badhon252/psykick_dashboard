// components/common/PublicRoute.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/") // 🔥 redirect to home if already logged in
    }
  }, [user, isLoading, router])

  if (isLoading) return null // Or loading spinner

  return <>{children}</>
}
