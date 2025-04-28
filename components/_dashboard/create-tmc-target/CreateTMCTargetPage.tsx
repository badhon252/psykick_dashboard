"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner"; // If you want toast notification

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

  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const { data } = useQuery({
    queryKey: ["tmsleaderboardData"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-all-category-images`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!token, // Only fetch if token is ready
  });

  const createTMCTargetMutation = useMutation({
    mutationFn: async (payload: {
      targetImage: string;
      controlImages: string[];
      revealTime: string;
      bufferTime: string;
      gameTime: string;
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
      toast.success("Target created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  interface ImageData {
    id: string;
    src: string;
    alt: string;
  }

  interface SubCategory {
    name: string;
    images: {
      _id: string;
      imageUrl: string;
    }[];
  }

  interface Category {
    categoryName: string;
    subCategories: SubCategory[];
  }

  interface QueryData {
    data: Category[];
  }

  const allImages: ImageData[] =
    (data as QueryData)?.data.flatMap((category) =>
      category.subCategories.flatMap((subCategory) =>
        subCategory.images.map((image) => ({
          id: image._id,
          src: image.imageUrl,
          alt: `${category.categoryName} - ${subCategory.name}`,
        }))
      )
    ) || [];

  const visibleTargetImages = showMoreTargets
    ? allImages
    : allImages.slice(0, 15);
  const visibleControlImages = showMoreControls
    ? allImages
    : allImages.slice(0, 15);

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

  const handleCreateTarget = () => {
    if (!selectedTargetImage || selectedControlImages.length === 0) {
      toast.error("Please select a target and at least one control image.");
      return;
    }

    const now = new Date();
    const gameTime = new Date(now);
    const revealTime = new Date(now);
    const bufferTime = new Date(now);

    gameTime.setMinutes(gameTime.getMinutes() + selectedMinutes);
    gameTime.setHours(gameTime.getHours() + selectedHours);
    gameTime.setDate(gameTime.getDate() + selectedDays);

    revealTime.setTime(gameTime.getTime() + 2 * 60 * 60 * 1000); // Example: Reveal after 2 hours
    bufferTime.setTime(gameTime.getTime() + 3 * 60 * 60 * 1000); // Example: Buffer after 3 hours

    const targetImage = allImages.find(
      (img) => img.id === selectedTargetImage
    )?.src;
    const controlImages = selectedControlImages
      .map((id) => allImages.find((img) => img.id === id)?.src)
      .filter((src): src is string => !!src); // Filter out undefined values

    if (!targetImage || controlImages.length === 0) {
      toast.error("Invalid target or control images.");
      return;
    }

    const payload = {
      targetImage,
      controlImages,
      revealTime: revealTime.toISOString(),
      bufferTime: bufferTime.toISOString(),
      gameTime: gameTime.toISOString(),
    };

    createTMCTargetMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          <CardContent className="space-y-6">
            {/* Target Images */}
            <div className="space-y-4">
              <h3 className="text-white text-lg">
                Select Target Image (only 1):
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {visibleTargetImages.map((image) => (
                  <div
                    key={image.id}
                    className={cn(
                      "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                      selectedTargetImage === image.id && "border-[#8F37FF]"
                    )}
                    onClick={() => handleSelectTargetImage(image.id)}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    {selectedTargetImage === image.id && (
                      <div className="absolute top-2 left-2 bg-[#8F37FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                        1
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
                  onClick={() => setShowMoreTargets(!showMoreTargets)}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {visibleControlImages.map((image) => (
                  <div
                    key={image.id}
                    className={cn(
                      "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                      selectedControlImages.includes(image.id) &&
                        "border-[#8F37FF]"
                    )}
                    onClick={() => handleSelectControlImage(image.id)}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    {selectedControlImages.includes(image.id) && (
                      <div className="absolute top-2 left-2 bg-[#8F37FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                        {selectedControlImages.indexOf(image.id) + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
                  onClick={() => setShowMoreControls(!showMoreControls)}
                >
                  {showMoreControls ? "Show Less" : "See More"}
                </Button>
              </div>
            </div>

            {/* Time Picker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Days", "Hours", "Minutes"].map((label, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-sm text-white">{label}</label>
                  <Select
                    onValueChange={(value) => {
                      const intValue = parseInt(value, 10);
                      if (label === "Days") setSelectedDays(intValue);
                      else if (label === "Hours") setSelectedHours(intValue);
                      else setSelectedMinutes(intValue);
                    }}
                  >
                    <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({
                        length:
                          label === "Days" ? 31 : label === "Hours" ? 24 : 60,
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

            {/* Create Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleCreateTarget}
                className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
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
            <div className="border-4 border-red-500 rounded-lg overflow-hidden max-w-2xl mx-auto">
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
      </main>
    </div>
  );
}
