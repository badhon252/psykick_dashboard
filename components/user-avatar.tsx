import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  image?: string
  className?: string
  role?: string
}

export function UserAvatar({ name, image, className, role }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("h-8 w-8", className)}>
        <AvatarImage src={image || "/placeholder-user.jpg"} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        {role && <span className="text-xs text-muted-foreground">{role}</span>}
      </div>
    </div>
  )
}
