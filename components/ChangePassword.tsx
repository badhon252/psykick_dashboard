/* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useState } from "react";

// const ChangePassword = () => {
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = {
//       currentPassword,
//       newPassword,
//       confirmNewPassword,
//     };

//     console.log(formData);
//   };

//   return (
//     <div className="p-4 w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-white">Change Password</h1>
//         <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
//           Edit
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-white mb-1">Current Password</label>
//             <input
//               type="password"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white"
//               placeholder="Enter your new password"
//             />
//           </div>

//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block text-white mb-1">New Password</label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white"
//                 placeholder="Enter your new password"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block text-white mb-1">Confirm New Password</label>
//               <input
//                 type="password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//                 className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white"
//                 placeholder="Enter your confirm new password"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const ChangePassword = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBhNGIzYzk2ZDMyMDRmMjJiYjBlMGIiLCJpYXQiOjE3NDU2NDUwNDAsImV4cCI6MTc0NjI0OTg0MH0.zQKFaBLX4gvAL93KpHzSBcgLpNT0EO6y3mYZHknCPqk";

  const mutation = useMutation({
    mutationFn: async (formData: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      const response = await fetch(
        "http://localhost:5001/api/v1/admin/change-password",
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
    onSuccess: (data) => {
      console.log("Password changed successfully:", data);
      alert("Password changed successfully!");
    },
    onError: (error: any) => {
      console.error("Password change failed:", error);
      alert(error.message || "Failed to change password");
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
        <div>
        <div className="space-y-8  p-6">
          <div>
            <label className="block text-white mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
              placeholder="Enter your new password"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
                placeholder="Enter your new password"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
                placeholder="Enter your confirm new password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className=" text-white px-6 py-2 rounded-md btn"
            >
              Save Changes
            </button>
          </div>
        </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
