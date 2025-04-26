import { useMutation } from "@tanstack/react-query"

type LoginInput = {
  email: string
  password: string
}

type LoginResponse = {
  status: boolean
  message: string
  data: {
    _id: string
    email: string
    screenName: string
    fullName: string
    country: string
    dob: string
    password: string
    city: string
    targetsLeft: number
    lastActive: string
    phoneNumber: string
  }
  accessToken: string
}

async function loginApi({ email, password }: LoginInput): Promise<LoginResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Login failed")
  }

  return res.json()
}

export function useLogin() {
  return useMutation({ mutationFn: loginApi })
}
