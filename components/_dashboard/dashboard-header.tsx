"use client";

import { BellRing } from "lucide-react";
import { MdOutlineDashboard } from "react-icons/md";
// import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { AdminDashboardTabsList, type NavigationItem } from "@/data/data";
import { useMemo } from "react";
// import profileImg from "../../../.././../public/assets/img/dashboard-profile.png";

interface HeaderProps {
  // userImage?: string | StaticImageData;
  userName?: string;
  userRole?: string;
}

export default function Header({
  // userImage = profileImg,
  userName = "Aliana",
  userRole = "Admin",
}: HeaderProps) {
  const pathname = usePathname();

  // Use useMemo to memoize the routeTitles map and associated icons
  const routeData = useMemo(
    () =>
      AdminDashboardTabsList.reduce(
        (
          acc: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: { title: string; icon: React.ComponentType<any> };
          },
          item: NavigationItem,
        ) => {
          acc[item.path] = { title: item.linkText, icon: item.icon };
          return acc;
        },
        {},
      ),
    [],
  );

  // Get the route title and icon
  const currentRoute = routeData[pathname] || {
    title: "Dashboard",
    icon: MdOutlineDashboard,
  };
  const { title, icon: Icon } = currentRoute;

  // Notification button JSX
  const notificationButton = (
    <button
      className="rounded-full border p-2 text-white hover:bg-black/20 hover:rotate-12 duration-300"
      aria-label="Notifications"
    >
      <BellRing className="h-5 w-5" />
      <span className="sr-only">Notifications</span>
    </button>
  );

  // User profile JSX
  const userProfile = (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
        {/* <Image src={userImage} alt={userName} fill className="object-cover" /> */}
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium text-white">{userName}</span>
        <span className="text-left text-xs text-white/60">{userRole}</span>
      </div>
    </div>
  );

  return (
    <header className="flex h-[84px] items-center justify-between px-6 ">
      <div className="flex items-center gap-2">
        {/* Display the current route's icon and title */}
        <Icon className="h-5 w-5 text-white" />
        <h1 className="text-lg font-medium text-white ">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {notificationButton}
        {userProfile}
      </div>
    </header>
  );
}
