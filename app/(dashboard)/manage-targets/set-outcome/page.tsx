"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

interface ARVTarget {
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
  controlImage: string;
}

interface APIResponse {
  status: boolean;
  data: ARVTarget;
  message: string;
}

export default function SetOutcomePage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading } = useQuery<APIResponse>({
    queryKey: ["activeARVTarget"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-activeARVTarget`
      ).then((res) => res.json()),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-white">No active target found</div>
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-resultImage/${data.data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resultImage: selectedImage }),
        }
      );

      const result = await response.json();

      if (result.status) {
        alert("Outcome set successfully");
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
                  {data.data.code}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Event Name</p>
                <p className="text-white text-xl">{data.data.eventName}</p>
              </div>
              <div>
                <p className="text-gray-400">Event Descriptions</p>
                <p className="text-white text-xl">
                  {data.data.eventDescription}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Game Time</p>
                <p className="text-white">
                  {moment(data.data.gameTime).format("MMMM Do YYYY, h:mm a")}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Reveal Time & Date</p>
                <p className="text-white">
                  {moment(data.data.revealTime).format("MMMM Do YYYY, h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Outcome time</p>
                <p className="text-white">
                  {moment(data.data.outcomeTime).format("MMMM Do YYYY, h:mm a")}
                </p>
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
            {[data.data.image1, data.data.image2, data.data.image3].map(
              (image, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-white/5 backdrop-blur-sm p-4 rounded-lg cursor-pointer transition-all",
                    selectedImage === image.url
                      ? "ring-2 ring-[red]"
                      : "hover:bg-[purple]/50"
                  )}
                  onClick={() => handleSelectOutcome(image.url)}
                >
                  <div className="aspect-square relative mb-3">
                    <Image
                      src={image.url}
                      alt={`Target image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-white text-sm">{image.description}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Selected Outcome */}
        {selectedImage && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Selected Outcome
            </h2>
            <div className="max-w-[300px] mx-auto border-4 border-[red] rounded-lg ">
              <div className="aspect-square relative">
                <Image
                  src={selectedImage}
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
