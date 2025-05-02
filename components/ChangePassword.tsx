import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const token = localStorage.getItem("token");

  const mutation = useMutation({
    mutationFn: async (formData: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: string) => {
      const errorMessage =
        (error as { message?: string })?.message ||
        "Password change failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = {
      currentPassword: form.currentPassword.value,
      newPassword: form.newPassword.value,
      confirmNewPassword: form.confirmNewPassword.value,
    };

    mutation.mutate(formData);
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-lg p-4 flex items-center justify-between h-[78px]">
        <h2 className="text-xl font-semibold text-white">Change Password</h2>
        <a href="/settings">
          <Button className="bg-white text-[#2D17FF] hover:bg-white/90 px-4 py-2 rounded-md flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Button>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg">
        <div className="space-y-8 p-6">
          {/* Current Password */}
          <div className="relative">
            <label className="block text-white mb-1">Current Password</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white pr-10"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-9 text-white"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password & Confirm New Password */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className="block text-white mb-1">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white pr-10"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 text-white"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex-1 relative">
              <label className="block text-white mb-1">
                Confirm New Password
              </label>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white pr-10"
                placeholder="Enter your confirm new password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="absolute right-3 top-9 text-white"
              >
                {showConfirmNewPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="text-white px-6 py-2 rounded-md btn"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
