"use client";
import { useQuery } from "@tanstack/react-query";
import { ImageCard } from "./image-card";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types for API responses
interface CategoryImage {
  imageId: string;
  categoryId: string;
  categoryName: string;
  subcategoryName: string;
  image: string;
  isUsed?: boolean;
}

interface CategoryImageApiResponse {
  status: boolean;
  data: CategoryImage[];
  message: string;
}

interface UsedImageApiResponse {
  status: boolean;
  data: CategoryImage[];
  message: string;
}

export function ImageGalleryPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [filterStatus, setFilterStatus] = useState<"all" | "used" | "unused">(
    "all"
  );

  // Fetch all images
  const {
    data: allImagesData,
    isLoading: isLoadingAllImages,
    isError: isErrorAllImages,
    error: errorAllImages,
  } = useQuery<CategoryImageApiResponse>({
    queryKey: ["all-image-gallery"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-all-images`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    enabled: !!token,
  });

  // Fetch used images
  const {
    data: usedImagesData,
    isLoading: isLoadingUsedImages,
    isError: isErrorUsedImages,
    error: errorUsedImages,
  } = useQuery<UsedImageApiResponse>({
    queryKey: ["used-image-gallery"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-all-used-images`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((res) => res.json()),
    enabled: !!token,
  });

  // Merge data and add isUsed property
  const processedImages = useMemo(() => {
    if (!allImagesData?.data) return [];

    const usedImageIds = new Set(
      usedImagesData?.data?.map((img) => img.imageId) || []
    );

    return allImagesData.data.map((image) => ({
      ...image,
      isUsed: usedImageIds.has(image.imageId),
    }));
  }, [allImagesData?.data, usedImagesData?.data]);

  console.log("All Images:", allImagesData?.data);
  console.log("Used Images:", usedImagesData?.data);
  console.log("Processed Images:", processedImages);

  // Filter images based on usage status
  const filteredImages = processedImages.filter((image) => {
    if (filterStatus === "used") return image.isUsed === true;
    if (filterStatus === "unused") return image.isUsed === false;
    return true; // show all
  });

  // Count statistics
  const totalImages = processedImages.length;
  const usedImages = processedImages.filter(
    (img) => img.isUsed === true
  ).length;
  const unusedImages = totalImages - usedImages;

  // Loading state - show loading if either query is loading
  const isLoading = isLoadingAllImages || isLoadingUsedImages;

  // Error state - show error if either query has error
  const isError = isErrorAllImages || isErrorUsedImages;
  const error = errorAllImages || errorUsedImages;

  let content;
  if (isLoading) {
    content = (
      <div className="w-full p-5 ">
        <TableSkeletonWrapper
          count={8}
          width="100%"
          height="320px"
          className="bg-[#E6EEF6]"
        />
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || "Something went Wrong"} />
      </div>
    );
  } else if (processedImages.length === 0) {
    content = (
      <div className="p-8 text-center text-gray-400">
        No Image available in gallery, please add/Upload image to gallery!
      </div>
    );
  } else if (filteredImages.length === 0) {
    content = (
      <div className="p-8 text-center text-gray-400">
        No images found for the selected filter. Try changing the filter or add
        more images.
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] md:gap-[25px] lg:gap-[30px] mt-[4px] p-8">
        {filteredImages?.map((image, index) => (
          <ImageCard key={image.imageId || index} data={image} />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pt-0 flex-1">
        <div className="bg-[#7abfff]/10 rounded-[16px] ">
          <h2 className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-[16px] text-[28px] font-semibold text-white leading-[120%] px-[40px] py-[22px]">
            Image Gallery
          </h2>

          {/* Filter Controls and Statistics */}
          <div className="px-8 pt-6 pb-4 border-b border-gray-200/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Statistics */}
              <div className="flex gap-6 text-sm">
                <div className="text-white">
                  <span className="font-medium">Total:</span> {totalImages}
                </div>
                <div className="text-green-400">
                  <span className="font-medium">Available:</span> {unusedImages}
                </div>
                <div className="text-red-400">
                  <span className="font-medium">Used:</span> {usedImages}
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-medium">Filter:</span>
                <Select
                  value={filterStatus}
                  onValueChange={(value: "all" | "used" | "unused") =>
                    setFilterStatus(value)
                  }
                >
                  <SelectTrigger className="w-[140px] bg-[#170A2C] border-gray-700 text-white">
                    <SelectValue placeholder="Filter images" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#170A2C] border-gray-700 text-white">
                    <SelectItem value="all">All Images</SelectItem>
                    <SelectItem value="unused">Not Used</SelectItem>
                    <SelectItem value="used">Used Only</SelectItem>
                  </SelectContent>
                </Select>

                {/* Quick filter buttons */}
                <div className="flex gap-2 *:text-black">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className="text-xs"
                  >
                    All ({totalImages})
                  </Button>
                  <Button
                    variant={filterStatus === "unused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("unused")}
                    className="text-xs"
                  >
                    Not Used ({unusedImages})
                  </Button>
                  <Button
                    variant={filterStatus === "used" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("used")}
                    className="text-xs"
                  >
                    Used ({usedImages})
                  </Button>
                </div>
              </div>
            </div>

            {/* Active filter indicator */}
            {filterStatus !== "all" && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  Showing {filteredImages?.length} {filterStatus} images
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className="text-xs text-blue-400 hover:text-blue-300 p-1 h-auto"
                >
                  Clear filter
                </Button>
              </div>
            )}

            {/* Loading indicator for used images */}
            {isLoadingUsedImages && !isLoadingAllImages && (
              <div className="mt-3 text-sm text-yellow-400">
                Loading usage status...
              </div>
            )}
          </div>

          <div>{content}</div>
        </div>
      </div>
    </div>
  );
}
