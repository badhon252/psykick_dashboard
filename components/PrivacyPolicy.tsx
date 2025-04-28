'use client'
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Function to fetch and update privacy policy
const PrivacyPolicy = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch privacy policy using TanStack Query
  const { data: privacyPolicyData, isLoading, isError } = useQuery({
    queryKey: ["privacyData", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/privacy-policy/get-privacy-policies`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch privacy policy");
      }
      return res.json();
    },
    enabled: !!token,
  });


  const id = privacyPolicyData?.data[0]?._id;
  console.log(privacyPolicyData?.data[0].whatWeOffer)

  // Use useEffect to set the content only when the privacyPolicyData changes
  useEffect(() => {
    if (privacyPolicyData?.data && privacyPolicyData.data.length > 0) {
      setContent(privacyPolicyData.data[0].content); // Assuming the content is inside the first object of the 'data' array
    }
  }, [privacyPolicyData]);

  const handleEditClick = () => setIsEditing(true);

  // Handle Cancel button click
  const handleCancelEdit = () => setIsEditing(false);

  // Handle Save Changes
  const handleSaveChanges = async () => {
    setIsSaving(true);

    const updatedData = { content };
    console.log(updatedData)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/privacy-policy/create-privacy-policy/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const result = await response.json();
      console.log(result); // You can log or show a success message here
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Quill editor modules and formats configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading Privacy Policy...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">Failed to fetch privacy policy</div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto bg-[#FDFDFD1A] rounded-lg">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
        {!isEditing ? (
          <div className="flex items-center gap-4">
            <a href="/settings">
              <Button className="bg-white text-[#2D17FF] hover:bg-white/90 px-4 py-2 rounded-md flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Settings
              </Button>
            </a>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
              onClick={handleEditClick}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-x-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-300"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-purple-800 bg-opacity-80 rounded-lg p-6 shadow-lg">
        {isEditing ? (
          <div className="quill-editor-container privacy-policy-quill">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="rounded-lg p-4"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-300"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md transition duration-300"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-white space-y-4 overflow-y-auto">
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="prose prose-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;

