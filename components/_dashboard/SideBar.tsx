"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useState, useCallback, useMemo } from "react";
import { NavigationItem } from "@/data/data";
import { LogOut, Menu } from "lucide-react";
import logo from "@/public/assets/logo.svg";
import { useAuth } from "@/context/AuthContext";

interface Props {
  lists: NavigationItem[];
}

export function Sidebar({ lists }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { logout } = useAuth();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const NavigationContent = useMemo(() => {
    return (
      <nav className="min-w-[272px] flex-1 px-10">
        {lists.map((item) => {
          const Icon = item.icon;
          const normalizedPathname = pathname.replace(/\/$/, "");
          const normalizedItemPath = item.path.replace(/\/$/, "");
          const isActive =
            normalizedPathname === normalizedItemPath ||
            (item.path === "/dashboard/" && normalizedPathname === "/dashboard");

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
              <Icon className="h-5 w-5 transition-colors group-hover:text-white" />
              <span className="font-inter text-sm font-medium leading-[20.3px] transition-colors group-hover:text-white">
                {item.linkText}
              </span>
              {!isActive && (
                <span className="absolute inset-0 -z-10 rounded-md bg-gradient opacity-0 transition-opacity group-hover:opacity-100"></span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }, [lists, pathname, closeMenu]);

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
                  <Image src={logo} alt="psykick.club" width={120} height={60} />
                </Link>
              </div>
              {NavigationContent}
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
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-4 m-10"
        >
          Logout <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }, [NavigationContent]);

  return (
    <>
      {MobileHeader}
      {DesktopSidebar}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-200 p-6 rounded-2xl shadow-lg text-center space-y-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleLogout}
                className="text-white rounded-xl bg-green-500"
              >
                Yes
              </Button>
              <Button
                onClick={() => setIsLogoutModalOpen(false)}
                variant="outline"
                className="rounded-xl bg-red-500 hover:bg-red-600"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
