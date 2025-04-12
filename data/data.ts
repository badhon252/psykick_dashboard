"use client";
import { LayoutDashboard, Mail } from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import { CiImageOn, CiSettings } from "react-icons/ci";
import { FaFileMedical } from "react-icons/fa";
import { FaFileAlt, FaChartBar } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";

export type NavigationItem = {
  id: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  linkText: string;
  roles: string[];
};

export const AdminDashboardTabsList = [
  {
    id: crypto.randomUUID(),
    path: "/",
    icon: LayoutDashboard,
    linkText: "Dashboard",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/upload-images",
    icon: CiImageOn,
    linkText: "Upload Images",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/manage-targets",
    icon: TbTargetArrow,
    linkText: "Manage Targets",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/create-tmc-target",
    icon: FaFileMedical,
    linkText: "Create TMC Target",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/create-arv-target",
    icon: FaFileAlt,
    linkText: "Create ARV Target",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/user-results",
    icon: FaChartBar,
    linkText: "User Results",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/email-manager",
    icon: Mail,
    linkText: "Email Manager",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/image-gallery",
    icon: GrGallery,
    linkText: "Image Gallery",
    roles: ["admin"],
  },
  {
    id: crypto.randomUUID(),
    path: "/settings",
    icon: CiSettings,
    linkText: "Settings",
    roles: ["admin"],
  },
] as NavigationItem[];
