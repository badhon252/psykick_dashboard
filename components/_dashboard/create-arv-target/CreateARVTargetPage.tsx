"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

// Define proper type instead of using `any`
type ImageOption = {
  imageId: string;
  image: string;
  categoryName: string;
  subcategoryName: string;
};

export default function CreateARVTargetPage() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [revealDate, setRevealDate] = useState("");
  const [revealTime, setRevealTime] = useState("");
  const [outcomeDate, setOutcomeDate] = useState("");
  const [outcomeTime, setOutcomeTime] = useState("");
  const [bufferDate, setBufferDate] = useState("");
  const [bufferTime, setBufferTime] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [controlImage, setControlImage] = useState("");
  const [token, setToken] = useState("");
  const [images, setImages] = useState([
    { id: 1, description: "", url: "" },
    { id: 2, description: "", url: "" },
    { id: 3, description: "", url: "" },
  ]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleSubmit = async () => {
    if (!token) return alert("User not authenticated! Please log in again.");

    const payload = {
      eventName,
      eventDescription,
      revealTime: `${revealDate}T${revealTime}:00`,
      outcomeTime: `${outcomeDate}T${outcomeTime}:00`,
      bufferTime: `${bufferDate}T${bufferTime}:00`,
      gameTime: `${gameDate}T${gameTime}:00`,
      controlImage,
      image1: images[0],
      image2: images[1],
      image3: images[2],
    };

    try {
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
      alert(
        res.ok
          ? "ARV Target created successfully!"
          : `Error: ${data.message || "Failed"}`
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Check console for details.");
    }
  };

  const {
    data: imageAll,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["imageAll"],
    queryFn: async () => {
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

  const allImageHere: ImageOption[] = imageAll?.data || [];
  // const selectedUrls = images.map((img) => img.url);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          <CardHeader>
            <CardTitle className="text-white">Create ARV Target</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Time Settings */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-between bg-[#170A2C] border-gray-700 text-white"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Times</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showTimePicker ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {showTimePicker && (
                <div className="mt-4 border border-gray-700 rounded-lg bg-[#170A2C]/30 p-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Game Time Section */}
                    <div className="space-y-4 p-3 border border-gray-700 rounded-md bg-[#170A2C]/20">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Game Time
                      </h3>
                      <p className="text-xs text-gray-400">
                        When the game will be available to play
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Date
                          </label>
                          <Input
                            type="date"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={gameDate}
                            onChange={(e) => setGameDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Time
                          </label>
                          <Input
                            type="time"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={gameTime}
                            onChange={(e) => setGameTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reveal Time Section */}
                    <div className="space-y-4 p-3 border border-gray-700 rounded-md bg-[#170A2C]/20">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Reveal Time
                      </h3>
                      <p className="text-xs text-gray-400">
                        When the target will be revealed to viewers
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Date
                          </label>
                          <Input
                            type="date"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={revealDate}
                            onChange={(e) => setRevealDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Time
                          </label>
                          <Input
                            type="time"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={revealTime}
                            onChange={(e) => setRevealTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Outcome Time Section */}
                    <div className="space-y-4 p-3 border border-gray-700 rounded-md bg-[#170A2C]/20">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Outcome Time
                      </h3>
                      <p className="text-xs text-gray-400">
                        When the outcome will be determined
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Date
                          </label>
                          <Input
                            type="date"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={outcomeDate}
                            onChange={(e) => setOutcomeDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Time
                          </label>
                          <Input
                            type="time"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={outcomeTime}
                            onChange={(e) => setOutcomeTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Buffer Time Section */}
                    <div className="space-y-4 p-3 border border-gray-700 rounded-md bg-[#170A2C]/20">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Buffer Time
                      </h3>
                      <p className="text-xs text-gray-400">
                        Additional time buffer after outcome
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Date
                          </label>
                          <Input
                            type="date"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={bufferDate}
                            onChange={(e) => setBufferDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-white flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Time
                          </label>
                          <Input
                            type="time"
                            className="bg-[#170A2C] border-gray-700 text-white h-9"
                            value={bufferTime}
                            onChange={(e) => setBufferTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 border border-gray-700 rounded-md bg-[#170A2C]/20">
                    <h3 className="text-white font-medium mb-2">
                      Timeline Preview
                    </h3>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                      <div className="relative pl-6 pb-4">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-purple-500"></div>
                        <p className="text-white text-sm font-medium">
                          Game Time
                        </p>
                        <p className="text-xs text-gray-400">
                          {gameDate && gameTime
                            ? new Date(
                                `${gameDate}T${gameTime}`
                              ).toLocaleString()
                            : "Not set"}
                        </p>
                      </div>

                      <div className="relative pl-6 pb-4">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-blue-500"></div>
                        <p className="text-white text-sm font-medium">
                          Reveal Time
                        </p>
                        <p className="text-xs text-gray-400">
                          {revealDate && revealTime
                            ? new Date(
                                `${revealDate}T${revealTime}`
                              ).toLocaleString()
                            : "Not set"}
                        </p>
                      </div>

                      <div className="relative pl-6 pb-4">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-500"></div>
                        <p className="text-white text-sm font-medium">
                          Outcome Time
                        </p>
                        <p className="text-xs text-gray-400">
                          {outcomeDate && outcomeTime
                            ? new Date(
                                `${outcomeDate}T${outcomeTime}`
                              ).toLocaleString()
                            : "Not set"}
                        </p>
                      </div>

                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-yellow-500"></div>
                        <p className="text-white text-sm font-medium">
                          Buffer Time
                        </p>
                        <p className="text-xs text-gray-400">
                          {bufferDate && bufferTime
                            ? new Date(
                                `${bufferDate}T${bufferTime}`
                              ).toLocaleString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">
                Select Your Images
              </h3>
              <p className="text-sm text-gray-400">
                Select 3 unique images for your target and 1 control image
              </p>

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
                          onClick={() => {
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
                              const emptySlotIndex = images.findIndex(
                                (i) => i.url === ""
                              );

                              if (emptySlotIndex !== -1 && !controlImage) {
                                // If we have an empty slot and no control image yet, ask which one to set
                                if (
                                  window.confirm(
                                    "Use this as a main image? Click Cancel to use as control image."
                                  )
                                ) {
                                  const updatedImages = [...images];
                                  updatedImages[emptySlotIndex].url = img.image;
                                  setImages(updatedImages);
                                } else {
                                  setControlImage(img.image);
                                }
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
                          }}
                          className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
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
                            className="w-full h-48 object-cover"
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
              <Button className="btn h-[59px]" onClick={handleSubmit}>
                Create Target
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
