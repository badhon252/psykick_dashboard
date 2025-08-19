"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ARVTarget {
  revealDuration: string;
  _id: string;
  code: string;
  eventName: string;
  eventDescription: string;
  revealTime: string;
  outcomeTime: string;
  gameTime: string;
  image1: { url: string; description: string };
  image2: { url: string; description: string };
  image3: { url: string; description: string };
  // controlImage: string;
}

interface APIResponse {
  status: boolean;
  data: ARVTarget[]; // Corrected: data is an array of ARVTarget
  message: string;
}

export default function SetOutcomePage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const pathName = usePathname();

  // Extract the ID from the pathname
  const pathSegments = pathName.split("/");
  const targetId = pathSegments[pathSegments.length - 1];

  const { data, isLoading } = useQuery<APIResponse>({
    queryKey: ["arvTargetsWithNullResultImage"], // Changed queryKey for clarity
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-ARVTargetWithNullResultImage/`
      ).then((res) => res.json()),
  });

  // Filter the data to find the specific target based on the extracted ID
  const filteredTarget = data?.data?.find((target) => target._id === targetId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  if (!filteredTarget) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-white">
          No target found for ID: {targetId}
        </div>
      </div>
    );
  }

  const handleSelectOutcome = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSubmitOutcome = async () => {
    if (!selectedImage) {
      alert("Please select an outcome image first");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-resultImage/${filteredTarget._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resultImage: selectedImage }),
        }
      );
      const result = await response.json();
      if (result.status) {
        toast.success("Outcome set successfully");
        router.push("/manage-targets");
      } else {
        alert(result.message || "Failed to set outcome");
      }
    } catch (error) {
      alert("An error occurred while setting the outcome");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Header Information */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-4">
          <h1 className="text-2xl font-bold text-white mb-6">Set Outcome</h1>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Revealed Target Code</p>
                <p className="text-white text-xl font-semibold">
                  {filteredTarget.code}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Event Name</p>
                <p className="text-white text-xl">{filteredTarget.eventName}</p>
              </div>
              <div>
                <p className="text-gray-400">Event Descriptions</p>
                <p className="text-white text-xl">
                  {filteredTarget.eventDescription}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Game Time</p>
                <p className="text-white">{filteredTarget.gameTime}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Reveal Time & Date</p>
                <p className="text-white">{filteredTarget.revealTime}</p>
              </div>
              <div>
                <p className="text-gray-400">Outcome time</p>
                <p className="text-white">{filteredTarget.outcomeTime}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Target Images */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Target Images
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              filteredTarget.image1,
              filteredTarget.image2,
              filteredTarget.image3,
              // filteredTarget.controlImage,
            ]?.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white/5 backdrop-blur-sm p-4 rounded-lg cursor-pointer transition-all",
                  selectedImage ===
                    (typeof image === "string" ? image : image?.url)
                    ? "ring-2 ring-[red]"
                    : "hover:bg-[purple]/50"
                )}
                onClick={() =>
                  handleSelectOutcome(
                    typeof image === "string" ? image : image.url
                  )
                }
              >
                <div className="aspect-square relative mb-3">
                  <Image
                    src={typeof image === "string" ? image : image.url}
                    alt={`Target image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-white text-center text-sm">
                  {typeof image === "string" ? "" : image.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Selected Outcome */}
        {selectedImage && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Selected Outcome Image
            </h2>
            <div className="max-w-[300px] mx-auto border-2 border-[red] rounded-lg ">
              <div className="aspect-square relative">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected outcome"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmitOutcome}
            disabled={!selectedImage}
            className={cn(
              "px-8 py-3 rounded-lg font-semibold text-white",
              !selectedImage ? "bg-gray-600" : "bg-[#8F37FF] hover:bg-[#7c2ee0]"
            )}
          >
            Set Outcome
          </Button>
        </div>
      </div>
    </div>
  );
}
