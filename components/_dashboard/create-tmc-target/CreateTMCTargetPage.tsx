"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  imageUrl: string;
  isUsed: boolean;
  _id: string;
};

interface ImageData {
  id: string;
  src: string;
  alt: string;
}

// interface SubCategory {
//   name: string;
//   images: {
//     _id: string;
//     imageUrl: string;
//   }[];
// }

// interface Category {
//   categoryName: string;
//   subCategories: SubCategory[];
// }

// interface QueryData {
//   data: Category[];
// }

type AllImagesResponse = {
  status: boolean;
  message: string;
  data: ImageOption[];
};

type ImageOption = {
  usedAt: string;
  status: string;
  imageId: string;
  image: string;
  categoryName: string;
  subcategoryName: string;
  categoryId: string;
  isUsed?: boolean;
};

export default function CreateTMCTargetPage() {
  const [selectedTargetImage, setSelectedTargetImage] = useState<string | null>(
    null
  );
  const [selectedControlImages, setSelectedControlImages] = useState<string[]>(
    []
  );
  const [showMoreTargets, setShowMoreTargets] = useState(false);
  const [showMoreControls, setShowMoreControls] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Category and subcategory filters
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  // Game Time settings
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  // Reveal Time settings - hours after game time
  const [revealHours, setRevealHours] = useState<number>(0);
  const [revealMinutes, setRevealMinutes] = useState<number>(5);

  // Buffer Time settings - hours after game time
  const [bufferHours, setBufferHours] = useState<number>(0);
  const [bufferMinutes, setBufferMinutes] = useState<number>(5);

  // Current timing mode
  const [timingMode, setTimingMode] = useState<"simple" | "advanced">("simple");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory === "") {
      setSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [selectedCategory]);

  // Fetch all images with proper typing
  const { data: allImagesData, isLoading: isLoadingAllImages } =
    useQuery<AllImagesResponse>({
      queryKey: ["allImages"],
      queryFn: async () => {
        if (!token) throw new Error("No authentication token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-all-images`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
      enabled: !!token,
    });

  // Fetch categories
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
    if (categoryData?.status && categoryData.data) {
      setCategories(categoryData.data);
    }
  }, [categoryData]);

  // Fetch subcategories when category changes
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
    if (subcategoryData?.status && subcategoryData.data) {
      setSubcategories(subcategoryData.data);
    }
  }, [subcategoryData]);

  // Fetch subcategory images when subcategory changes
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

  const createTMCTargetMutation = useMutation({
    mutationFn: async (payload: {
      targetImage: string;
      controlImages: string[];
      revealTime: string;
      bufferTime: string;
      gameStart: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/create-TMCTarget`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success(
        "TMC Target created successfully! All image statuses have been updated."
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  // Handle category and subcategory selection
  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(value);
    }
  };

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
  };

  // Process images based on filters
  const allImages: ImageData[] = useMemo(() => {
    if (
      selectedCategory &&
      selectedSubcategory &&
      subcategoryImages?.data?.[0]?.images
    ) {
      // Return filtered images by subcategory
      return subcategoryImages.data[0].images.map((image) => ({
        id: image._id,
        src: image.imageUrl,
        alt: `${selectedCategory} - ${selectedSubcategory}`,
      }));
    } else {
      // Return all images
      return (
        (allImagesData as AllImagesResponse)?.data?.map((image) => ({
          id: image.imageId,
          src: image.image,
          alt: `${image.categoryName} - ${image.subcategoryName}`,
        })) || []
      );
    }
  }, [allImagesData, selectedCategory, selectedSubcategory, subcategoryImages]);

  // const visibleTargetImages = showMoreTargets
  //   ? allImages
  //   : allImages.slice(0, 15);
  // const visibleControlImages = showMoreControls
  //   ? allImages
  //   : allImages.slice(0, 15);

  const handleSelectTargetImage = (id: string) => {
    setSelectedTargetImage(id);
  };

  const handleSelectControlImage = (id: string) => {
    if (selectedControlImages.includes(id)) {
      setSelectedControlImages((prev) => prev.filter((imgId) => imgId !== id));
    } else {
      if (selectedControlImages.length < 5) {
        setSelectedControlImages((prev) => [...prev, id]);
      }
    }
  };

  const handleCreateTarget = async () => {
    if (!selectedTargetImage || selectedControlImages.length === 0) {
      toast.error("Please select a target and at least one control image.");
      return;
    }

    try {
      // Step 1: Collect all selected image IDs
      const allSelectedImageIds = [
        selectedTargetImage,
        ...selectedControlImages,
      ];

      // Step 2: Find corresponding imageId and categoryId for each selected image
      const imageUpdateRequests = allSelectedImageIds
        .map((imageId) => {
          const imageData = allImagesData?.data?.find(
            (img) => img.imageId === imageId
          );
          if (!imageData) {
            console.warn(`Image data not found for ID: ${imageId}`);
            return null;
          }
          return {
            imageId: imageData.imageId,
            categoryId: imageData.categoryId,
            url: imageData.image,
          };
        })
        .filter(Boolean); // Remove null entries

      if (imageUpdateRequests.length !== allSelectedImageIds.length) {
        toast.error(
          "Some selected images could not be found in the database. Please refresh and try again."
        );
        return;
      }

      // Step 3: Update image status for all selected images
      console.log("Updating image status for selected images...");

      const updatePromises = imageUpdateRequests.map(async (imageData) => {
        if (!imageData) {
          throw new Error("Image data is missing");
        }
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

      // Step 4: Calculate timing
      const now = new Date();
      const gameStart = new Date(now);
      let revealTime = new Date(now);
      let bufferTime = new Date(now);

      // Set game time
      gameStart.setMinutes(gameStart.getMinutes() + selectedMinutes);
      gameStart.setHours(gameStart.getHours() + selectedHours);
      gameStart.setDate(gameStart.getDate() + selectedDays);

      // Set reveal and buffer times based on mode
      if (timingMode === "simple") {
        // Default: Reveal after 2 hours, Buffer after 3 hours
        revealTime = new Date(gameStart.getTime() + 2 * 60 * 60 * 1000);
        bufferTime = new Date(gameStart.getTime() + 3 * 60 * 60 * 1000);
      } else {
        // Advanced: Custom time offsets
        revealTime = new Date(
          gameStart.getTime() +
            revealHours * 60 * 60 * 1000 +
            revealMinutes * 60 * 1000
        );

        bufferTime = new Date(
          gameStart.getTime() +
            bufferHours * 60 * 60 * 1000 +
            bufferMinutes * 60 * 1000
        );
      }

      // Step 5: Get image URLs for the payload
      const targetImage = allImages.find(
        (img) => img.id === selectedTargetImage
      )?.src;
      const controlImages = selectedControlImages
        .map((id) => allImages.find((img) => img.id === id)?.src)
        .filter((src): src is string => !!src);

      if (!targetImage || controlImages.length === 0) {
        toast.error("Invalid target or control images.");
        return;
      }

      // Step 6: Create the TMC Target payload
      const payload = {
        targetImage,
        controlImages,
        revealTime: revealTime.toISOString(),
        bufferTime: bufferTime.toISOString(),
        gameStart: gameStart.toISOString(),
      };

      // Step 7: Create the TMC Target
      console.log("Creating TMC Target...");
      createTMCTargetMutation.mutate(payload);
    } catch (error: unknown) {
      console.error("Error in TMC target creation process:", error);

      if (error instanceof Error && error.message.includes("update status")) {
        toast.error(`Image status update failed: ${error.message}`);
      } else {
        toast.error(
          "An error occurred during target creation. Check console for details."
        );
      }
    }
  };

  const renderTimeSelectors = (
    label: string,
    hoursValue: number,
    minutesValue: number,
    onHoursChange: (hours: number) => void,
    onMinutesChange: (minutes: number) => void
  ) => (
    <div className="space-y-2">
      <h4 className="text-white text-sm">{label}</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Hours</label>
          <Select
            value={hoursValue.toString()}
            onValueChange={(value) => onHoursChange(Number.parseInt(value))}
          >
            <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
              <SelectValue placeholder="Hours" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Minutes</label>
          <Select
            value={minutesValue.toString()}
            onValueChange={(value) => onMinutesChange(Number.parseInt(value))}
          >
            <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
              <SelectValue placeholder="Minutes" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i} value={(i * 5).toString()}>
                  {i * 5}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Determine if we're loading images
  const isLoading =
    isLoadingAllImages ||
    (isLoadingSubcategoryImages && selectedCategory && selectedSubcategory);

  // Determine if there's an error loading images
  const isError =
    isErrorSubcategoryImages && selectedCategory && selectedSubcategory;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          <CardContent className="space-y-6 py-6">
            {/* Category and Subcategory Filters */}
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
                  <p className="text-xs text-gray-400">Loading categories...</p>
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

            {/* Target Images */}
            <div className="space-y-4">
              <h3 className="text-white text-lg">
                Select Target Image (only 1):
              </h3>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#170A2C] rounded-md h-32 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : isError ? (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-md">
                  <p className="text-red-400">
                    Error loading images. Please try again.
                  </p>
                </div>
              ) : allImages.length === 0 ? (
                <div className="p-4 bg-[#170A2C]/30 border border-gray-700 rounded-md text-center">
                  <p className="text-gray-400">
                    {selectedCategory && selectedSubcategory
                      ? "No images found for this subcategory"
                      : "No images available"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {allImagesData?.data.map((image) => (
                    <div
                      key={image.imageId}
                      className={cn(
                        "relative rounded-md  cursor-pointer border-2 border-transparent",
                        selectedTargetImage === image.imageId &&
                          "border-[#8F37FF]"
                      )}
                      onClick={() => handleSelectTargetImage(image.imageId)}
                    >
                      <Image
                        src={image.image || "/placeholder.svg"}
                        alt={image.categoryName}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover"
                      />
                      <Badge className="absolute text-[11px] -bottom-2 border border-black bg-[#36007b] text-white rounded-full">
                        {image.usedAt
                          ? `${image?.status} ${moment(
                              image?.usedAt
                            ).fromNow()}`
                          : `${image?.status}`}
                      </Badge>
                      {selectedTargetImage === image.imageId && (
                        <div className="absolute top-2 left-2 bg-[#8F37FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                          1
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
                  onClick={() => setShowMoreTargets(!showMoreTargets)}
                  disabled={allImages.length <= 15}
                >
                  {showMoreTargets ? "Show Less" : "See More"}
                </Button>
              </div>
            </div>

            {/* Control Images */}
            <div className="space-y-4">
              <h3 className="text-white text-lg">
                Select Control Images (max 5):
              </h3>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#170A2C] rounded-md h-32 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : isError ? (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-md">
                  <p className="text-red-400">
                    Error loading images. Please try again.
                  </p>
                </div>
              ) : allImages?.length === 0 ? (
                <div className="p-4 bg-[#170A2C]/30 border border-gray-700 rounded-md text-center">
                  <p className="text-gray-400">
                    {selectedCategory && selectedSubcategory
                      ? "No images found for this subcategory"
                      : "No images available"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {allImagesData?.data.map((image) => (
                    <div
                      key={image.imageId}
                      className={cn(
                        "relative rounded-md  cursor-pointer border-2 border-transparent",
                        selectedControlImages.includes(image.imageId) &&
                          "border-[#8F37FF]"
                      )}
                      onClick={() => handleSelectControlImage(image.imageId)}
                    >
                      <Image
                        src={image.image || "/placeholder.svg"}
                        alt={image.categoryName}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover"
                      />
                      <Badge className="absolute text-[11px] -top-2 -right-2 border border-black bg-[#36007b] text-white">
                        {image.usedAt
                          ? `${image?.status} ${moment(
                              image?.usedAt
                            ).fromNow()}`
                          : `${image?.status}`}
                      </Badge>
                      {selectedControlImages.includes(image.imageId) && (
                        <div className="absolute top-2 left-2 bg-[#8F37FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                          {selectedControlImages.indexOf(image.imageId) + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
                  onClick={() => setShowMoreControls(!showMoreControls)}
                  disabled={allImages.length <= 15}
                >
                  {showMoreControls ? "Show Less" : "See More"}
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Time Settings */}
            <div className="space-y-4">
              <h3 className="text-white text-lg">Time Settings</h3>

              <Tabs
                defaultValue="simple"
                value={timingMode}
                onValueChange={(v) => setTimingMode(v as "simple" | "advanced")}
                className="w-full"
              >
                <TabsList className="bg-[#221139] mb-4 w-full">
                  <TabsTrigger value="simple" className="flex-1">
                    Simple Mode
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex-1">
                    Advanced Mode
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="simple" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Days", "Hours", "Minutes"].map((label, idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-sm text-white">{label}</label>
                        <Select
                          value={
                            label === "Days"
                              ? selectedDays.toString()
                              : label === "Hours"
                              ? selectedHours.toString()
                              : selectedMinutes.toString()
                          }
                          onValueChange={(value) => {
                            const intValue = Number.parseInt(value, 10);
                            if (label === "Days") setSelectedDays(intValue);
                            else if (label === "Hours")
                              setSelectedHours(intValue);
                            else setSelectedMinutes(intValue);
                          }}
                        >
                          <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                            <SelectValue placeholder={`Select ${label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({
                              length:
                                label === "Days"
                                  ? 31
                                  : label === "Hours"
                                  ? 24
                                  : 60,
                            }).map((_, i) => (
                              <SelectItem
                                key={i}
                                value={`${i + (label === "Days" ? 1 : 0)}`}
                              >
                                {i + (label === "Days" ? 1 : 0)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-amber-400 bg-amber-500/10 p-3 rounded-md">
                    In simple mode, reveal time is set to 5 minutes after game
                    time and buffer time is set to 5 minutes after game time.
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Game Time */}
                    <div className="space-y-2">
                      <h4 className="text-white text-sm">
                        Game Time (From Now)
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            Days
                          </label>
                          <Select
                            value={selectedDays.toString()}
                            onValueChange={(value) =>
                              setSelectedDays(Number.parseInt(value))
                            }
                          >
                            <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                              <SelectValue placeholder="Days" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 31 }).map((_, i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            Hours
                          </label>
                          <Select
                            value={selectedHours.toString()}
                            onValueChange={(value) =>
                              setSelectedHours(Number.parseInt(value))
                            }
                          >
                            <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                              <SelectValue placeholder="Hours" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }).map((_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                  {i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            Minutes
                          </label>
                          <Select
                            value={selectedMinutes.toString()}
                            onValueChange={(value) =>
                              setSelectedMinutes(Number.parseInt(value))
                            }
                          >
                            <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                              <SelectValue placeholder="Minutes" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }).map((_, i) => (
                                <SelectItem key={i} value={(i * 5).toString()}>
                                  {i * 5}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Reveal Time (after game time) */}
                    {renderTimeSelectors(
                      "Reveal Time (after game time)",
                      revealHours,
                      revealMinutes,
                      setRevealHours,
                      setRevealMinutes
                    )}

                    {/* Buffer Time (after game time) */}
                    {renderTimeSelectors(
                      "Buffer Time (after game time)",
                      bufferHours,
                      bufferMinutes,
                      setBufferHours,
                      setBufferMinutes
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Create Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleCreateTarget}
                className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
                size="lg"
              >
                Create Target
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Target Preview */}
        {selectedTargetImage && (
          <div className="mt-8">
            <h2 className="text-white text-2xl text-center mb-4">
              Selected Target Preview
            </h2>
            <div className="border-4 border-red-500 rounded-lg overflow-hidden max-w-2xl mx-auto h-[400px] w-[400px]">
              <Image
                src={
                  allImages.find((img) => img.id === selectedTargetImage)
                    ?.src || "/placeholder.svg"
                }
                alt="Selected target"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Timing Preview */}
        {(selectedDays > 0 || selectedHours > 0 || selectedMinutes > 0) && (
          <Card className="bg-[#170A2C]/50 border-0 mt-6">
            <CardContent className="py-6">
              <h3 className="text-white text-lg mb-4">Time Settings Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#221139] p-4 rounded-md">
                  <h4 className="text-purple-300 font-medium mb-2">
                    Game Time
                  </h4>
                  <p className="text-white">
                    {new Date(
                      Date.now() +
                        selectedDays * 24 * 60 * 60 * 1000 +
                        selectedHours * 60 * 60 * 1000 +
                        selectedMinutes * 60 * 1000
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#221139] p-4 rounded-md">
                  <h4 className="text-purple-300 font-medium mb-2">
                    Reveal Time
                  </h4>
                  <p className="text-white">
                    {new Date(
                      Date.now() +
                        selectedDays * 24 * 60 * 60 * 1000 +
                        selectedHours * 60 * 60 * 1000 +
                        selectedMinutes * 60 * 1000 +
                        (timingMode === "simple"
                          ? 2 * 60 * 60 * 1000
                          : revealHours * 60 * 60 * 1000 +
                            revealMinutes * 60 * 1000)
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#221139] p-4 rounded-md">
                  <h4 className="text-purple-300 font-medium mb-2">
                    Buffer Time
                  </h4>
                  <p className="text-white">
                    {new Date(
                      Date.now() +
                        selectedDays * 24 * 60 * 60 * 1000 +
                        selectedHours * 60 * 60 * 1000 +
                        selectedMinutes * 60 * 1000 +
                        (timingMode === "simple"
                          ? 3 * 60 * 60 * 1000
                          : bufferHours * 60 * 60 * 1000 +
                            bufferMinutes * 60 * 1000)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
