// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "./ui/button";
// import { ArrowLeft } from "lucide-react";

// const AboutUs = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     whoWeAre: "",
//     whatWeOffer: "",
//     whyChooseUs: "",
//     socialLinks: {
//       facebook: "",
//       twitter: "",
//       instagram: "",
//       linkedin: "",
//     },
//   });
//   const [isSaving, setIsSaving] = useState(false);

//   const token = localStorage.getItem("token");

//   const { data: aboutData, isLoading, isError } = useQuery({
//     queryKey: ["aboutUsData", token],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/about-us/get-aboutUs`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!res.ok) {
//         throw new Error("Failed to fetch about us data");
//       }
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   const aboutUs = aboutData?.data?.[0];

//   useEffect(() => {
//     if (aboutUs) {
//       setFormData({
//         whoWeAre: aboutUs.whoWeAre || "",
//         whatWeOffer: aboutUs.whatWeOffer || "",
//         whyChooseUs: aboutUs.whyChooseUs || "",
//         socialLinks: {
//           facebook: aboutUs.socialLinks?.facebook || "",
//           twitter: aboutUs.socialLinks?.twitter || "",
//           instagram: aboutUs.socialLinks?.instagram || "",
//           linkedin: aboutUs.socialLinks?.linkedin || "",
//         },
//       });
//     }
//   }, [aboutUs]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (name.startsWith("socialLinks.")) {
//       const key = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         socialLinks: {
//           ...prev.socialLinks,
//           [key]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSaveChanges = async () => {
//     if (!aboutUs?._id) return;
//     setIsSaving(true);

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/about-us/update-aboutUs/${aboutUs._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to save changes");
//       }

//       const result = await response.json();
//       console.log("Saved successfully:", result);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error saving changes:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading About Us...</div>;
//   }

//   if (isError) {
//     return <div>Error loading About Us</div>;
//   }

//   return (
//     <div className="p-6 w-full mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-semibold text-white">About Us</h1>
//         {!isEditing ? (
//           <div className="flex gap-4">
//             <a href="/settings">
//               <Button className="bg-white text-blue-600 hover:bg-white/90 flex items-center gap-2">
//                 <ArrowLeft className="w-4 h-4" /> Back
//               </Button>
//             </a>
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
//               onClick={() => setIsEditing(true)}
//             >
//               Edit
//             </button>
//           </div>
//         ) : (
//           <div className="flex gap-2">
//             <button
//               className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
//               onClick={() => setIsEditing(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
//               onClick={handleSaveChanges}
//               disabled={isSaving}
//             >
//               {isSaving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="bg-white rounded-lg p-6 shadow-lg">
//         {isEditing ? (
//           <div className="space-y-4">
//             <div>
//               <label className="font-semibold text-gray-700">Who We Are</label>
//               <textarea
//                 name="whoWeAre"
//                 value={formData.whoWeAre}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="font-semibold text-gray-700">What We Offer</label>
//               <textarea
//                 name="whatWeOffer"
//                 value={formData.whatWeOffer}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded bg-gray-50"
//               />
//             </div>
//             <div>
//               <label className="font-semibold text-gray-700">Why Choose Us</label>
//               <textarea
//                 name="whyChooseUs"
//                 value={formData.whyChooseUs}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded bg-gray-50"
//               />
//             </div>

//             <div>
//               <h2 className="font-semibold text-gray-700">Social Links</h2>
//               {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
//                 <div key={platform}>
//                   <label className="capitalize text-gray-700">{platform}</label>
//                   <input
//                     type="text"
//                     name={`socialLinks.${platform}`}
//                     value={(formData.socialLinks as any)[platform]}
//                     onChange={handleChange}
//                     className="w-full p-3 border rounded mb-2 bg-gray-50"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="text-gray-900 space-y-6">
//             <div>
//               <h2 className="text-xl font-semibold">Who We Are</h2>
//               <p>{formData.whoWeAre}</p>
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold">What We Offer</h2>
//               <p>{formData.whatWeOffer}</p>
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold">Why Choose Us</h2>
//               <p>{formData.whyChooseUs}</p>
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold">Social Links</h2>
//               <ul className="list-disc ml-5">
//                 <li>Facebook: {formData.socialLinks.facebook}</li>
//                 <li>Twitter: {formData.socialLinks.twitter}</li>
//                 <li>Instagram: {formData.socialLinks.instagram}</li>
//                 <li>LinkedIn: {formData.socialLinks.linkedin}</li>
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AboutUs;






/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const AboutUs = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    whoWeAre: "",
    whatWeOffer: "",
    whyChooseUs: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("token");

  const { data: aboutData, isLoading, isError } = useQuery({
    queryKey: ["aboutUsData", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/about-us/get-aboutUs`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch about us data");
      }
      return res.json();
    },
    enabled: !!token,
  });

  const aboutUs = aboutData?.data?.[0];

  useEffect(() => {
    if (aboutUs) {
      setFormData({
        whoWeAre: aboutUs.whoWeAre || "",
        whatWeOffer: aboutUs.whatWeOffer || "",
        whyChooseUs: aboutUs.whyChooseUs || "",
        socialLinks: {
          facebook: aboutUs.socialLinks?.facebook || "",
          twitter: aboutUs.socialLinks?.twitter || "",
          instagram: aboutUs.socialLinks?.instagram || "",
          linkedin: aboutUs.socialLinks?.linkedin || "",
        },
      });
    }
  }, [aboutUs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    if (!aboutUs?._id) return;
    setIsSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/about-us/update-aboutUs/${aboutUs._id}`,
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
        throw new Error("Failed to save changes");
      }

      const result = await response.json();
      console.log("Saved successfully:", result);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading About Us...</div>;
  }

  if (isError) {
    return <div>Error loading About Us</div>;
  }

  return (
    <div className="p-6 w-full mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-white">About Us</h1>
        {!isEditing ? (
          <div className="flex gap-4">
            <a href="/settings">
              <Button className="bg-white text-blue-600 hover:bg-white/90 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back settings
              </Button>
            </a>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2 rounded-md text-white flex items-center justify-center gap-2 ${
                isSaving
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      <div
        className={`rounded-lg p-6 shadow-lg transition-colors duration-300 ${
          isSaving ? "bg-gray-200" : "bg-white"
        }`}
      >
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Who We Are</label>
              <textarea
                name="whoWeAre"
                value={formData.whoWeAre}
                onChange={handleChange}
                className="w-full p-3 border rounded text-black"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">What We Offer</label>
              <textarea
                name="whatWeOffer"
                value={formData.whatWeOffer}
                onChange={handleChange}
                className="w-full p-3 border rounded text-black"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Why Choose Us</label>
              <textarea
                name="whyChooseUs"
                value={formData.whyChooseUs}
                onChange={handleChange}
                className="w-full p-3 border rounded text-black"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-700">Social Links</h2>
              {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
                <div key={platform}>
                  <label className="capitalize text-gray-700">{platform}</label>
                  <input
                    type="text"
                    name={`socialLinks.${platform}`}
                    value={(formData.socialLinks as any)[platform]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded mb-2 text-black"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-900 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Who We Are</h2>
              <p>{formData.whoWeAre}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">What We Offer</h2>
              <p>{formData.whatWeOffer}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Why Choose Us</h2>
              <p>{formData.whyChooseUs}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Social Links</h2>
              <ul className="list-disc ml-5">
                <li>Facebook: {formData.socialLinks.facebook}</li>
                <li>Twitter: {formData.socialLinks.twitter}</li>
                <li>Instagram: {formData.socialLinks.instagram}</li>
                <li>LinkedIn: {formData.socialLinks.linkedin}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;

