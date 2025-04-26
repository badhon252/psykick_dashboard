"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
// import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
//   const { toast } = useToast()
  const router = useRouter()
  
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${baseURL}/admin/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send OTP')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
    //   toast({
    //     title: "Success",
    //     description: data.message || "Your OTP has been sent",
    //   })
    toast.success(data.message || "Your OTP has been sent")
      
      // Store email in sessionStorage for later use
      sessionStorage.setItem('resetEmail', email)
      
      // Navigate to verify OTP page
      router.push('/verify-otp')
    },
    onError: (error) => {
    //   toast({
    //     title: "Error",
    //     description: error instanceof Error ? error.message : "Failed to send OTP",
    //     variant: "destructive",
    //   })
    toast.error(error instanceof Error ? error.message : "Failed to send OTP")
    }
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    forgotPasswordMutation.mutate(email)
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/space-bg.png')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-black/30 text-white border border-white/10">
        <h1 className="text-2xl font-bold text-center mb-2">Forget Password?</h1>
        <p className="text-sm text-center text-gray-300 mb-6">
          You may receive email notifications from us to reset your password for
          security and login purposes.
        </p>
        
        <h2 className="text-xl font-bold mb-4">Enter your Personal Information</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block">Email address</label>
              <Input
                id="email"
                type="email"
                placeholder="Write your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}