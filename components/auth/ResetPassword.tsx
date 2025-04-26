"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<string>("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("resetEmail")
    if (!storedEmail) {
      // Redirect to forgot password if no email is found
      router.push("/forgot-password")
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; newPassword: string }) => {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${baseURL}/admin/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reset password")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      })

      // Clear the email from sessionStorage
      sessionStorage.removeItem("resetEmail")

      // Navigate to login page
      router.push("/login")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    // Send only email and newPassword to the API
    resetPasswordMutation.mutate({
      email,
      newPassword,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/space-bg.png')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-black/30 text-white border border-white/10">
        <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-sm text-center text-gray-300 mb-6">Create your password</p>

        <h2 className="text-xl font-bold mb-4">Enter your Personal Information</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newPassword">New Password</label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-transparent border-white/20 text-white placeholder:text-gray-400 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-transparent border-white/20 text-white placeholder:text-gray-400 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
