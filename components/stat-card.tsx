import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-gradient rounded-lg p-6 flex justify-between items-center", className)}>
      <div>
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="bg-white/10 p-3 rounded-full">
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  )
}
