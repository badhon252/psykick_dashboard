/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const PersonalInformation = () => {
  const token = localStorage.getItem("token");

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        "http://localhost:5001/api/v1/admin/profile",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Do NOT set Content-Type when using FormData
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data);
      alert("Profile updated successfully!");
    },
    onError: (error: any) => {
      console.error("Profile update failed:", error);
      alert(error.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    // Create FormData object to submit all fields
    const formData = new FormData();
    formData.append("fullName", form.fullName.value);
    formData.append("username", form.username.value);
    formData.append("email", form.email.value);
    formData.append("phone", form.phone.value);
    formData.append("country", form.country.value);
    formData.append("city", form.city.value);
    formData.append("street", form.street.value);
    formData.append("about", form.about.value);

    // Use the mutation to send the form data
    mutation.mutate(formData);
  };

  return (
    <div className="w-full">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-lg p-4 flex items-center justify-between h-[78px]">
        <h2 className="text-xl font-semibold text-white">
          Personal Information
        </h2>
        <a href="/settings">
          <Button className="bg-white text-[#2D17FF] hover:bg-white/90 px-4 py-2 rounded-md flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Button>
        </a>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-lg p-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {/* Form Inputs */}
            <div>
              <label className="block text-white mb-1">Full Name</label>
              <input
                name="fullName"
                type="text"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Username</label>
              <input
                name="username"
                type="text"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Email address</label>
              <input
                name="email"
                type="email"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Phone Number</label>
              <input
                name="phone"
                type="tel"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-white mb-1">Country</label>
                <input
                  name="country"
                  type="text"
                  className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-white mb-1">Town/City</label>
                <input
                  name="city"
                  type="text"
                  className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-1">Street Address</label>
              <input
                name="street"
                type="text"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">About</label>
              <textarea
                name="about"
                className="w-full p-2 rounded-md bg-[#C5C5C5] bg-opacity-10 border border-[#C5C5C5] outline-none text-white"
                placeholder="Write here description."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md btn w-[220px] h-[51px]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
