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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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

  // Game Time settings
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  // Reveal Time settings - hours after game time
  const [revealHours, setRevealHours] = useState<number>(2);
  const [revealMinutes, setRevealMinutes] = useState<number>(0);

  // Buffer Time settings - hours after game time
  const [bufferHours, setBufferHours] = useState<number>(3);
  const [bufferMinutes, setBufferMinutes] = useState<number>(0);

  // Current timing mode
  const [timingMode, setTimingMode] = useState<"simple" | "advanced">("simple");

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
    (data as QueryData)?.data?.flatMap((category) =>
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
    let revealTime = new Date(now);
    let bufferTime = new Date(now);

    // Set game time
    gameTime.setMinutes(gameTime.getMinutes() + selectedMinutes);
    gameTime.setHours(gameTime.getHours() + selectedHours);
    gameTime.setDate(gameTime.getDate() + selectedDays);

    // Set reveal and buffer times based on mode
    if (timingMode === "simple") {
      // Default: Reveal after 2 hours, Buffer after 3 hours
      revealTime = new Date(gameTime.getTime() + 2 * 60 * 60 * 1000);
      bufferTime = new Date(gameTime.getTime() + 3 * 60 * 60 * 1000);
    } else {
      // Advanced: Custom time offsets
      revealTime = new Date(
        gameTime.getTime() +
          revealHours * 60 * 60 * 1000 +
          revealMinutes * 60 * 1000
      );

      bufferTime = new Date(
        gameTime.getTime() +
          bufferHours * 60 * 60 * 1000 +
          bufferMinutes * 60 * 1000
      );
    }

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

    const payload = {
      targetImage,
      controlImages,
      revealTime: revealTime.toISOString(),
      bufferTime: bufferTime.toISOString(),
      gameTime: gameTime.toISOString(),
    };

    createTMCTargetMutation.mutate(payload);
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          <CardContent className="space-y-6 py-6">
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
                    In simple mode, reveal time is set to 2 hours after game
                    time and buffer time is set to 3 hours after game time.
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
