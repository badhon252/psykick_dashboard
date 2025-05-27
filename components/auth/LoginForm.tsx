"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          login(data.data, data.accessToken);
          toast.success("Login successful!");
          router.push("/"); // ✅ Redirect to home page
        },
        onError: (error) => {
          console.error(error);
          toast.error(error.message || "Login failed"); // ✅ Error toast
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/space-background.png')] bg-cover bg-center p-4">
      <div className="w-full max-w-md rounded-lg bg-slate-800/80 p-8 backdrop-blur-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Log In
        </h1>
        <p className="mb-6 text-center text-sm text-gray-300">
          Continue to register as a customer or vendor.
        </p>

        <h2 className="mb-4 text-xl font-semibold text-white">
          Enter your Personal Information
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-white">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Write your email"
              className="w-full rounded-md border border-gray-600 bg-slate-700/50 p-3 text-white placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-white">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-600 bg-slate-700/50 p-3 text-white placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mb-4 w-full rounded-md bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-purple-400"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>

          {error && (
            <p className="text-center text-sm text-red-400">
              Login failed. Try again.
            </p>
          )}
        </form>

        <div className="text-center">
          <a
            href="/forget-password"
            className="text-sm text-gray-300 hover:text-white"
          >
            Forget your password?
          </a>
        </div>
      </div>
    </div>
  );
}
