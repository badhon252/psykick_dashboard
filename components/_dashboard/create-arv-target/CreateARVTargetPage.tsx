"use client";

import { useMemo } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

// Define proper types for API responses
type CategoryResponse = {
  status: boolean;
  message: string;
  data: CategoryData[];
};

type CategoryData = {
  categoryName: string;
  subCategoryNames: string[];
};

type SubcategoryResponse = {
  status: boolean;
  message: string;
  data: string[];
};

type SubcategoryImagesResponse = {
  status: boolean;
  message: string;
  data: SubcategoryImageData[];
};

type SubcategoryImageData = {
  name: string;
  images: SubcategoryImage[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

type SubcategoryImage = {
  status: string;
  imageUrl: string;
  isUsed: boolean;
  _id: string;
};

type AllImagesResponse = {
  status: boolean;
  message: string;
  data: ImageOption[];
};

// Define proper type instead of using `any`
type ImageOption = {
  usedAt?: string | null;
  status?: string;
  imageId: string;
  image: string;
  categoryName: string;
  subcategoryName: string;
  isUsed?: boolean;
  categoryId?: string;
};

// Define type for form images
type FormImage = {
  id: number;
  description: string;
  url: string;
};

export default function CreateARVTargetPage() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [controlImage, setControlImage] = useState("");
  const [token, setToken] = useState("");
  const [images, setImages] = useState<FormImage[]>([
    { id: 1, description: "", url: "" },
    { id: 2, description: "", url: "" },
    { id: 3, description: "", url: "" },
  ]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [pendingImage, setPendingImage] = useState<ImageOption | null>(null);
  const [pendingEmptySlot, setPendingEmptySlot] = useState(-1);

  // Updated state variables for ISO time inputs
  const [gameTime, setGameTime] = useState("");
  const [revealTime, setRevealTime] = useState("");
  const [outcomeTime, setOutcomeTime] = useState("");

  const [timeOrderError, setTimeOrderError] = useState<string | null>(null);

  // Helper to get default datetime-local value (current time + offset)
  const getDefaultDateTime = (hoursOffset = 1): string => {
    const now = new Date();
    now.setHours(now.getHours() + hoursOffset);

    // Format for datetime-local input (YYYY-MM-DDTHH:MM)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Helper to convert local datetime to proper format for backend
  const convertToProperFormat = (localDateTimeString: string): string => {
    if (!localDateTimeString) return "";

    // Create a Date object from the local datetime string
    // This will be in the user's local timezone
    const localDate = new Date(localDateTimeString);

    // Option 1: If you want to send the exact local time to backend
    // Format: YYYY-MM-DDTHH:MM:SS (local time)
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    const seconds = String(localDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    // Option 2: If your backend expects UTC, uncomment this instead:
    // return localDate.toISOString();

    // Option 3: If your backend needs timezone info, uncomment this:
    /*
    const timezoneOffset = -localDate.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
    */
  };

  // Helper to validate time order
  const validateTimeOrder = (): string | null => {
    if (!gameTime || !revealTime || !outcomeTime) {
      return null; // Don't validate if any time is missing
    }

    const game = new Date(gameTime);
    const reveal = new Date(revealTime);
    const outcome = new Date(outcomeTime);

    if (game >= reveal) {
      return "Game time must be before reveal time";
    }
    if (reveal >= outcome) {
      return "Reveal time must be before outcome time";
    }

    return null; // All times are in correct order
  };

  // Initialize with default values
  useEffect(() => {
    if (!gameTime) setGameTime(getDefaultDateTime(1));
    if (!revealTime) setRevealTime(getDefaultDateTime(2));
    if (!outcomeTime) setOutcomeTime(getDefaultDateTime(3));
  }, [gameTime, revealTime, outcomeTime]);

  // Validate time order whenever times change
  useEffect(() => {
    const error = validateTimeOrder();
    setTimeOrderError(error);
  }, [gameTime, revealTime, outcomeTime]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(value);
    }
  };

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory === "") {
      setSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [selectedCategory]);

  const handleSubmit = async () => {
    if (!token) return alert("User not authenticated! Please log in again.");

    // Validate required fields
    if (!eventName) return alert("Event name is required");
    if (!eventDescription) return alert("Event description is required");
    if (!gameTime) return alert("Game time is required");
    if (!revealTime) return alert("Reveal time is required");
    if (!outcomeTime) return alert("Outcome time is required");
    if (!controlImage) return alert("Control image is required");
    if (!images[0].url || !images[1].url || !images[2].url)
      return toast.warning("All three target images are required");

    // Validate that times are in the future
    const now = new Date();
    const gameDateTime = new Date(gameTime);
    const revealDateTime = new Date(revealTime);
    const outcomeDateTime = new Date(outcomeTime);

    if (gameDateTime <= now) return alert("Game time must be in the future");
    if (revealDateTime <= now)
      return alert("Reveal time must be in the future");
    if (outcomeDateTime <= now)
      return alert("Outcome time must be in the future");

    // Validate time order
    const timeOrderError = validateTimeOrder();
    if (timeOrderError) return alert(timeOrderError);

    try {
      // Step 1: Collect all image URLs that need status updates
      const imageUrls = [
        controlImage,
        images[0].url,
        images[1].url,
        images[2].url,
      ];

      // Step 2: Find corresponding imageId and categoryId for each image
      type ImageUpdateRequest = {
        imageId: string;
        categoryId: string;
        url: string;
      };

      const imageUpdateRequests = imageUrls
        .map((url) => {
          const imageData = imageAll?.data?.find((img) => img.image === url);
          if (!imageData) {
            console.warn(`Image data not found for URL: ${url}`);
            return null;
          }
          return {
            imageId: imageData.imageId,
            categoryId: imageData.categoryId,
            url: url,
          };
        })
        .filter((request): request is ImageUpdateRequest => request !== null);

      if (imageUpdateRequests.length !== imageUrls.length) {
        return alert(
          "Some selected images could not be found in the database. Please refresh and try again."
        );
      }

      // Step 3: Update image status for all selected images
      console.log("Updating image status for selected images...");
      const updatePromises = imageUpdateRequests.map(async (imageData) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/update-image-status/${imageData.categoryId}/${imageData.imageId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to update status for image ${imageData.imageId}: ${
              errorData.message || response.statusText
            }`
          );
        }
        return response.json();
      });

      // Wait for all image status updates to complete
      await Promise.all(updatePromises);
      console.log("All image statuses updated successfully");

      // Step 4: Create the game payload with properly formatted timestamps
      const payload = {
        eventName,
        eventDescription,
        gameTime: convertToProperFormat(gameTime),
        revealTime: convertToProperFormat(revealTime),
        outcomeTime: convertToProperFormat(outcomeTime),
        controlImage,
        image1: { url: images[0].url, description: images[0].description },
        image2: { url: images[1].url, description: images[1].description },
        image3: { url: images[2].url, description: images[2].description },
      };

      // Debug: Log the timestamps being sent
      console.log("Original datetime-local values:", {
        gameTime,
        revealTime,
        outcomeTime,
      });

      console.log("Converted timestamps for backend:", {
        gameTime: payload.gameTime,
        revealTime: payload.revealTime,
        outcomeTime: payload.outcomeTime,
      });

      // Step 5: Create the ARV Target
      console.log("Creating ARV Target...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/create-ARVTarget`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(
          "ARV Target created successfully! All image statuses have been updated."
        );
        // Optionally reset the form or redirect
        // resetForm();
      } else {
        // If game creation fails after image updates, you might want to revert image statuses
        console.error("Game creation failed:", data.message);
        alert(`Error creating game: ${data.message || "Failed"}`);
      }
    } catch (error: unknown) {
      console.error("Error in game creation process:", error);
      if (error instanceof Error && error.message.includes("update status")) {
        alert(`Image status update failed: ${error.message}`);
      } else {
        alert(
          "An error occurred during game creation. Check console for details."
        );
      }
    }
  };

  const {
    data: imageAll,
    isLoading: isLoadingAllImages,
    isError: isErrorAllImages,
  } = useQuery<AllImagesResponse>({
    queryKey: ["imageAll"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-all-images`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch images");
      return res.json();
    },
    enabled: !!token,
  });

  const {
    data: categoryData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<CategoryResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category-and-subcategory-names`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (categoryData?.status && categoryData?.data) {
      setCategories(categoryData.data);
    }
  }, [categoryData]);

  const {
    data: subcategoryData,
    isLoading: isLoadingSubcategories,
    isError: isErrorSubcategories,
  } = useQuery<SubcategoryResponse>({
    queryKey: ["subcategories", selectedCategory],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      if (!selectedCategory || selectedCategory === "")
        return { status: true, message: "", data: [] };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-subcategories/${selectedCategory}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      return res.json();
    },
    enabled: !!token && !!selectedCategory && selectedCategory !== "",
  });

  useEffect(() => {
    if (subcategoryData?.status && subcategoryData?.data) {
      setSubcategories(subcategoryData.data);
      setSelectedSubcategory(subcategoryData.data[0] || "");
    }
  }, [subcategoryData]);

  const {
    data: subcategoryImages,
    isLoading: isLoadingSubcategoryImages,
    isError: isErrorSubcategoryImages,
  } = useQuery<SubcategoryImagesResponse>({
    queryKey: ["subcategoryImages", selectedCategory, selectedSubcategory],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      if (!selectedCategory || !selectedSubcategory)
        return { status: true, message: "", data: [] };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-subcategory-images/${selectedCategory}/${selectedSubcategory}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch subcategory images");
      return res.json();
    },
    enabled: !!token && !!selectedCategory && !!selectedSubcategory,
  });

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
  };

  // Determine which images to display based on filters
  const allImageHere: ImageOption[] = useMemo(() => {
    if (
      selectedCategory &&
      selectedSubcategory &&
      subcategoryImages?.data?.[0]?.images
    ) {
      return subcategoryImages.data[0].images.map((img) => ({
        imageId: img._id,
        image: img.imageUrl,
        categoryName: selectedCategory,
        subcategoryName: selectedSubcategory,
        isUsed: img.isUsed,
      }));
    }
    return imageAll?.data || [];
  }, [selectedCategory, selectedSubcategory, subcategoryImages, imageAll]);

  // Handle image selection with modal
  const handleImageSelection = (img: ImageOption) => {
    // Check if this image is used as one of the 3 main images
    const mainImageIndex = images.findIndex((i) => i.url === img.image);
    const isMainImage = mainImageIndex !== -1;

    // Check if this image is the control image
    const isControlImage = controlImage === img.image;

    // Image is selected if it's either a main image or the control image
    const isSelected = isMainImage || isControlImage;

    // Disable selection if all 3 main images are selected and this isn't already selected
    // OR if control image is selected and this isn't the control image
    const disableSelection =
      !isSelected &&
      images.every((i) => i.url !== "") &&
      controlImage !== "" &&
      controlImage !== img.image;

    if (disableSelection) return;

    if (isMainImage) {
      // If already selected as main image, deselect it
      const updatedImages = [...images];
      updatedImages[mainImageIndex].url = "";
      setImages(updatedImages);
    } else if (isControlImage) {
      // If already selected as control image, deselect it
      setControlImage("");
    } else {
      // Find the first empty main image slot
      const emptySlotIndex = images.findIndex((i) => i.url === "");
      if (emptySlotIndex !== -1 && !controlImage) {
        // If we have an empty slot and no control image yet, show modal
        setPendingImage(img);
        setPendingEmptySlot(emptySlotIndex);
        setShowModal(true);
      } else if (emptySlotIndex !== -1) {
        // If we have an empty slot, set as main image
        const updatedImages = [...images];
        updatedImages[emptySlotIndex].url = img.image;
        setImages(updatedImages);
      } else if (!controlImage) {
        // If all main images filled but no control image, set as control
        setControlImage(img.image);
      }
    }
  };

  // Handle modal selection
  const handleModalSelection = (useAsMain: boolean) => {
    if (!pendingImage) return;

    if (useAsMain && pendingEmptySlot !== -1) {
      const updatedImages = [...images];
      updatedImages[pendingEmptySlot].url = pendingImage.image;
      setImages(updatedImages);
    } else {
      setControlImage(pendingImage.image);
    }

    // Reset modal state
    setShowModal(false);
    setPendingImage(null);
    setPendingEmptySlot(-1);
  };

  // Determine if we're loading images
  const isLoading =
    isLoadingAllImages ||
    (isLoadingSubcategoryImages && selectedCategory && selectedSubcategory);

  // Determine if there's an error loading images
  const isError =
    isErrorAllImages ||
    (isErrorSubcategoryImages && selectedCategory && selectedSubcategory);

  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          {/* <CardHeader>
            <CardTitle className="text-white">Create ARV Target</CardTitle>
          </CardHeader> */}
          <CardContent className="space-y-6 pt-6">
            {/* Event Name */}
            <div className="space-y-2">
              <label className="text-sm text-white">Event Name:</label>
              <Input
                placeholder="Write Event Name"
                className="bg-[#170A2C] border-gray-700 text-white"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <label className="text-sm text-white">Event Description:</label>
              <Textarea
                placeholder="Write Event Description"
                className="bg-[#170A2C] border-gray-700 text-white min-h-[100px]"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>

            {/* Time Settings - ISO DateTime Inputs */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Schedule Times
              </h3>
              {timeOrderError && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-md">
                  <p className="text-red-400 text-sm">{timeOrderError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-white font-semibold">
                    Game Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={gameTime}
                    onChange={(e) => setGameTime(e.target.value)}
                    className="bg-[#170A2C] border-gray-700 text-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {gameTime && (
                    <p className="text-xs text-gray-400">
                      {moment(gameTime).format("MMMM Do YYYY, h:mm A")} (
                      {moment(gameTime).fromNow()})
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-semibold">
                    Reveal Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={revealTime}
                    onChange={(e) => setRevealTime(e.target.value)}
                    className="bg-[#170A2C] border-gray-700 text-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {revealTime && (
                    <p className="text-xs text-gray-400">
                      {moment(revealTime).format("MMMM Do YYYY, h:mm A")} (
                      {moment(revealTime).fromNow()})
                      {gameTime &&
                        new Date(revealTime) <= new Date(gameTime) && (
                          <span className="text-red-400 block">
                            ⚠ Must be after game time
                          </span>
                        )}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-white font-semibold">
                    Outcome Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={outcomeTime}
                    onChange={(e) => setOutcomeTime(e.target.value)}
                    className="bg-[#170A2C] border-gray-700 text-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {outcomeTime && (
                    <p className="text-xs text-gray-400">
                      {moment(outcomeTime).format("MMMM Do YYYY, h:mm A")} (
                      {moment(outcomeTime).fromNow()})
                      {revealTime &&
                        new Date(outcomeTime) <= new Date(revealTime) && (
                          <span className="text-red-400 block">
                            ⚠ Must be after reveal time
                          </span>
                        )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">
                Select Your Images
              </h3>
              <p className="text-sm text-gray-400">
                Select 3 unique images for your target and 1 control image
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm text-white">Category:</label>
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#170A2C] border-gray-700 text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.categoryName}
                          value={category.categoryName}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingCategories && (
                    <p className="text-xs text-gray-400">
                      Loading categories...
                    </p>
                  )}
                  {isErrorCategories && (
                    <p className="text-xs text-red-400">
                      Error loading categories
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white">Subcategory:</label>
                  <Select
                    value={selectedSubcategory}
                    onValueChange={handleSubcategoryChange}
                    disabled={
                      !selectedCategory ||
                      selectedCategory === "" ||
                      isLoadingSubcategories
                    }
                  >
                    <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                      <SelectValue
                        placeholder={
                          !selectedCategory || selectedCategory === ""
                            ? "Select a category first"
                            : isLoadingSubcategories
                            ? "Loading subcategories..."
                            : "Select a subcategory"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#170A2C] border-gray-700 text-white">
                      {subcategories.length === 0 ? (
                        <div className="p-2 text-center text-gray-400 text-sm">
                          No subcategories found
                        </div>
                      ) : (
                        subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {isLoadingSubcategories && selectedCategory && (
                    <p className="text-xs text-gray-400">
                      Loading subcategories...
                    </p>
                  )}
                  {isErrorSubcategories && selectedCategory && (
                    <p className="text-xs text-red-400">
                      Error loading subcategories
                    </p>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-[#170A2C] rounded-lg h-48"></div>
                  ))}
                </div>
              ) : isError ? (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-md">
                  <p className="text-red-400">
                    Error loading images. Please try again.
                  </p>
                </div>
              ) : allImageHere.length === 0 ? (
                <div className="p-4 bg-[#170A2C]/30 border border-gray-700 rounded-md text-center">
                  <p className="text-gray-400">
                    {selectedCategory && selectedSubcategory
                      ? "No images found for this subcategory"
                      : "No images available"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Image Selection Gallery */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {allImageHere.map((img: ImageOption) => {
                      // Check if this image is used as one of the 3 main images
                      const mainImageIndex = images.findIndex(
                        (i) => i.url === img.image
                      );
                      const isMainImage = mainImageIndex !== -1;

                      // Check if this image is the control image
                      const isControlImage = controlImage === img.image;

                      // Image is selected if it's either a main image or the control image
                      const isSelected = isMainImage || isControlImage;

                      // Disable selection if all 3 main images are selected and this isn't already selected
                      // OR if control image is selected and this isn't the control image
                      const disableSelection =
                        !isSelected &&
                        images.every((i) => i.url !== "") &&
                        controlImage !== "" &&
                        controlImage !== img.image;

                      return (
                        <div
                          key={img.imageId}
                          onClick={() =>
                            !disableSelection && handleImageSelection(img)
                          }
                          className={`relative rounded-lg cursor-pointer border-2 transition-all ${
                            isMainImage
                              ? "border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30"
                              : isControlImage
                              ? "border-yellow-500 ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/30"
                              : "border-transparent hover:border-gray-600"
                          } ${
                            disableSelection
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <Image
                            width={300}
                            height={300}
                            src={img.image || "/placeholder.svg"}
                            alt={`${img.categoryName} - ${img.subcategoryName}`}
                            className="w-full aspect-square object-cover"
                          />
                          <Badge className="absolute text-[11px] -bottom-2 -right-2 z-30 border border-black bg-gradient text-white rounded-full">
                            {img.usedAt
                              ? `${img?.status} ${moment(
                                  img?.usedAt
                                ).fromNow()}`
                              : `${img?.status}`}
                          </Badge>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                            <p className="text-sm font-medium truncate">
                              {img.categoryName}
                            </p>
                            <p className="text-xs opacity-80 truncate">
                              {img.subcategoryName}
                            </p>
                          </div>
                          {isMainImage && (
                            <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Image {mainImageIndex + 1}
                            </div>
                          )}
                          {isControlImage && (
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Control
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Images Summary */}
                  <div className="mt-8 space-y-6">
                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                      Selected Images
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {images.map((image, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Image {index + 1}
                            </div>
                            {image.url ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...images];
                                  updated[index].url = "";
                                  updated[index].description = "";
                                  setImages(updated);
                                }}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            ) : (
                              <span className="text-xs text-amber-400">
                                Not selected
                              </span>
                            )}
                          </div>
                          {image.url ? (
                            <div className="relative border border-gray-700 rounded-md overflow-hidden bg-[#170A2C]/30">
                              <Image
                                width={300}
                                height={300}
                                src={image.url || "/placeholder.svg"}
                                alt={`Selected image ${index + 1}`}
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          ) : (
                            <div className="border border-dashed border-gray-700 rounded-md p-6 flex items-center justify-center bg-[#170A2C]/30 h-48">
                              <p className="text-gray-500 text-sm">
                                Select an image from the gallery above
                              </p>
                            </div>
                          )}
                          <Textarea
                            placeholder={`Write image-${index + 1} description`}
                            className="bg-[#170A2C] border-gray-700 text-white h-24"
                            value={image.description}
                            onChange={(e) => {
                              const updated = [...images];
                              updated[index].description = e.target.value;
                              setImages(updated);
                            }}
                            disabled={!image.url}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Control Image
                        </div>
                        {controlImage ? (
                          <button
                            type="button"
                            onClick={() => setControlImage("")}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-xs text-amber-400">
                            Not selected
                          </span>
                        )}
                      </div>
                      {controlImage ? (
                        <div className="relative border border-gray-700 rounded-md overflow-hidden bg-[#170A2C]/30">
                          <Image
                            width={300}
                            height={300}
                            src={controlImage || "/placeholder.svg"}
                            alt="Selected control image"
                            className="w-full h-[500px] object-cover"
                          />
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-700 rounded-md p-6 flex items-center justify-center bg-[#170A2C]/30 h-48">
                          <p className="text-gray-500 text-sm">
                            Select a control image from the gallery above
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-start">
              <Button
                className="btn h-[59px]"
                onClick={handleSubmit}
                type="button"
                disabled={!!timeOrderError}
              >
                Create Target
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Interactive Modal */}
      {showModal && pendingImage && (
        <div className="absolute bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 top-0 bottom-0 left-0 right-0">
          <div
            className="bg-[#170A2C] border border-gray-700 rounded-lg max-w-md w-full overflow-auto shadow-xl animate-in zoom-in-90 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">
                Select Image Type
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                <Image
                  width={300}
                  height={300}
                  src={pendingImage.image || "/placeholder.svg"}
                  alt={pendingImage.categoryName}
                  className="w-full h-full object-contain bg-black/30"
                />
              </div>
              <p className="text-white mb-6">
                How would you like to use this image?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handleModalSelection(true)}
                  className="border-2 border-purple-500 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-500/20 transition-colors"
                >
                  <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                    Main Image
                  </div>
                  <p className="text-white text-sm">
                    Use as main image for the target
                  </p>
                </div>
                <div
                  onClick={() => handleModalSelection(false)}
                  className="border-2 border-yellow-500 rounded-lg p-4 text-center cursor-pointer hover:bg-yellow-500/20 transition-colors"
                >
                  <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                    Control
                  </div>
                  <p className="text-white text-sm">Use as control image</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                type="button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
