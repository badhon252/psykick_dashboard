"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
// import PersonalInformation from "@/components/PersonalInformation";
import ChangePassword from "@/components/ChangePassword";
import TermsConditions from "@/components/TermsConditions";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import AboutUs from "@/components/AboutUs"; // Ensure this component exists
// import PersonalInformation from "@/components/PersonalInformation";
// import Image from "next/image";
// import vector1 from "@/public/assets/img/Vector1.png";

export default function GamingSettings() {
  const [activeSection, setActiveSection] = useState("settings");

  const renderContent = () => {
    switch (activeSection) {
      // case "personal":
      //   return <PersonalInformation />;
      case "password":
        return <ChangePassword />;
      case "terms":
        return <TermsConditions />;
      case "privacy":
        return <PrivacyPolicy />;
      case "about":
        return <AboutUs />;
      default:
        return <SettingsMenu setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="bg-[#FFFFFF1A] rounded-lg shadow-lg overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}

// Settings Menu Component
function SettingsMenu({
  setActiveSection,
}: {
  setActiveSection: (section: string) => void;
}) {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-lg p-4 flex items-center h-[78px]">
        
        <h2 className="text-xl font-semibold text-white">Settings</h2>
      </div>

      <div className="space-y-[36px] w-[95%] mx-auto mt-[24px] h-[650px]">
        {/* <MenuButton
          label="Personal Information"
          onClick={() => setActiveSection("personal")}
        /> */}
        <MenuButton
          label="Change Password"
          onClick={() => setActiveSection("password")}
        />
        <MenuButton
          label="Terms & Conditions"
          onClick={() => setActiveSection("terms")}
        />
        <MenuButton
          label="Privacy Policy"
          onClick={() => setActiveSection("privacy")}
        />
        <MenuButton
          label="About Us"
          onClick={() => setActiveSection("about")}
        />
      </div>
    </div>
  );
}

// Menu Button Component
function MenuButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="w-full h-[94px] p-4 bg-[#F9FAFD1A] rounded-lg text-white text-left flex justify-between items-center hover:bg-purple-600 transition-colors border border-[#9E9E9E]"
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronRight className="h-5 w-5" />
    </button>
  );

}
