"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useState, useCallback, useMemo } from "react";
import { NavigationItem } from "@/data/data";
import { LogOut, Menu } from "lucide-react";
import logo from "@/public/assets/logo.svg";

interface Props {
  lists: NavigationItem[];
}


export function Sidebar({ lists }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu callback for performance optimization
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const NavigationContent = useMemo(() => {
    return (
      <nav className="min-w-[272px] flex-1 px-10  ">
        {lists.map((item) => {
          const Icon = item.icon;

          // Normalize paths by removing trailing slashes
          const normalizedPathname = pathname.replace(/\/$/, "");
          const normalizedItemPath = item.path.replace(/\/$/, "");

          // Ensure the default dashboard route is considered active
          const isActive =
            normalizedPathname === normalizedItemPath ||
            (item.path === "/dashboard/" &&
              normalizedPathname === "/dashboard");

          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={closeMenu}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.linkText}
              className={`group relative my-4 mb-1 flex items-center gap-3 rounded-md px-4 py-3 transition-all backdrop-blur-md
                          ${isActive ? "bg-gradient text-white border-r-2" : "text-[#F4EBFF] hover:bg-gradient hover:text-white"}
                        `}
            >
              {/* Icon */}
              <Icon className="h-5 w-5 transition-colors group-hover:text-white" />

              {/* Link Text */}
              <span className="font-inter text-sm font-medium leading-[20.3px] transition-colors group-hover:text-white">
                {item.linkText}
              </span>

              {/* Optional: Small Overlay for Better Hover Feedback */}
              {!isActive && (
                <span className="absolute inset-0 -z-10 rounded-md bg-gradient opacity-0 transition-opacity group-hover:opacity-100"></span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }, [lists, pathname, closeMenu]);

  // const UserProfile = useMemo(() => {
  //   return (
  //     <div className="border-t border-white/10 p-4">
  //       <div className="flex items-center gap-3">
  //         <Avatar>
  //           <AvatarImage
  //             src="/placeholder-avatar.jpg"
  //             alt="User Profile Avatar"
  //           />
  //           <AvatarFallback>AE</AvatarFallback>
  //         </Avatar>
  //         <div>
  //           <p className="text-sm font-medium text-white">Alison Eyo</p>
  //           <p className="text-xs text-gray-400">alison.e@rayna.ui</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }, []);

  const MobileHeader = useMemo(() => {
    return (
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between bg-[#36007B] p-0 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src={logo} alt="psykick.club" width={194} height={38} />
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] bg-[#36007B] p-0 text-white"
          >
            <div className="flex h-full flex-col">
              <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src={logo}
                    alt="psykick.club"
                    width={120}
                    height={60}
                  />
                </Link>
              </div>
              {NavigationContent}
              {/* {UserProfile} */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }, [isOpen, NavigationContent]);

  const DesktopSidebar = useMemo(() => {
    return (
      <div className="fixed left-0 top-0 hidden h-screen max-w-[354px] flex-col overflow-y-auto md:flex">
        <div className="py-6">
          <Link href="/" className="flex items-center gap-2 justify-center">
            <Image src={logo} alt="Psykick.club" width={194} height={38} />
          </Link>
        </div>
        {NavigationContent}
        <button className="flex items-center  gap-4 m-10">Logout <LogOut className="h-4 w-4"/></button>
        {/* {UserProfile} */}
      </div>
    );
  }, [NavigationContent]);

  return (
    <>
      {MobileHeader}
      {DesktopSidebar}
    </>
  );
}
