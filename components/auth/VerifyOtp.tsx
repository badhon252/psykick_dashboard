"use client"

import { useState, useEffect, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const { toast } = useToast()
  const router = useRouter()
  
  useEffect(() => {
    // Check if we have an email in sessionStorage
    const email = sessionStorage.getItem('resetEmail')
    if (!email) {
      // Redirect to forgot password if no email is found
      router.push('/forgot-password')
    }
  }, [router])
  
  const verifyOtpMutation = useMutation({
    mutationFn: async (otpString: string) => {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${baseURL}/admin/verifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpString }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP')
      }
      
      return data
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "OTP verified successfully",
      })
      
      // Navigate to reset password page
      router.push('/reset-password')
    },
    onError: (error) => {
      setError("Your OTP is Wrong")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify OTP",
        variant: "destructive",
      })
    }
  })
  
  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return
    
    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Clear error when user types
    if (error) setError(null)
    
    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }
    
    verifyOtpMutation.mutate(otpString)
  }
  
  const handleResend = () => {
    const email = sessionStorage.getItem('resetEmail')
    if (email) {
      // Implement resend logic here
      toast({
        title: "Resending OTP",
        description: "A new OTP has been sent to your email",
      })
    } else {
      router.push('/forgot-password')
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/space-bg.png')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-black/30 text-white border border-white/10">
        <h1 className="text-2xl font-bold text-center mb-2">
          {error ? "Please Try Again" : "Verify Email"}
        </h1>
        <p className="text-sm text-center mb-6">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            "Please enter the OTP we have sent you in your Email Address."
          )}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-4 border">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-lg font-bold rounded-lg 
                  ${error ? 'bg-red-200/20 border-red-400/50' : 'bg-white/20 border-white/20'} 
                  focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            ))}
          </div>
          
          <div className="flex justify-between text-sm mb-6">
            <button 
              type="button" 
              className="text-gray-300 hover:text-white"
              onClick={() => router.push('/forgot-password')}
            >
              Didn&apos;t receive OTP
            </button>
            <button 
              type="button" 
              className="text-gray-300 hover:text-white"
              onClick={handleResend}
            >
              Resend
            </button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={verifyOtpMutation.isPending}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  )
}