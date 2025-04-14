import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-medium text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5 text-white" />
        </Button>
        <UserAvatar name="Aliana" role="Vendor" image="/placeholder-user.jpg" />
      </div>
    </div>
  )
}
