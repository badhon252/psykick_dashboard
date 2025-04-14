"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Upload, Target, Mail, ImageIcon, Settings, LogOut, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Upload Images",
      icon: Upload,
      href: "/upload-images",
      active: pathname === "/upload-images",
    },
    {
      label: "Manage Targets",
      icon: Target,
      href: "/manage-targets",
      active: pathname === "/manage-targets",
    },
    {
      label: "Create TMC Target",
      icon: Target,
      href: "/create-tmc-target",
      active: pathname === "/create-tmc-target",
    },
    {
      label: "Create ARV Target",
      icon: Target,
      href: "/create-arv-target",
      active: pathname === "/create-arv-target",
    },
    {
      label: "User Results",
      icon: Users,
      href: "/user-results",
      active: pathname === "/user-results",
    },
    {
      label: "Email Manager",
      icon: Mail,
      href: "/email-manager",
      active: pathname === "/email-manager",
    },
    {
      label: "Image Gallery",
      icon: ImageIcon,
      href: "/image-gallery",
      active: pathname === "/image-gallery",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="w-64 h-screen bg-[#170A2C] flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-[#8F37FF]">
            <span className="text-green-400">Psy</span>
            kick<span className="text-yellow-400">.club</span>
          </h1>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 p-3 text-sm rounded-md transition-colors",
              route.active ? "bg-[#8F37FF] text-white" : "text-gray-300 hover:bg-[#8F37FF]/10",
            )}
          >
            <route.icon className="w-5 h-5" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="p-4 mt-auto">
        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  )
}
