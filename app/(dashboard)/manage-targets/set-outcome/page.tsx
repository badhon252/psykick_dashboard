"use client";

import { useState, useEffect } from "react";
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
  revealTime: string;
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
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data, isLoading } = useQuery<APIResponse>({
    queryKey: ["activeARVTarget"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-activeARVTarget`
      ).then((res) => res.json()),
  });

  // Calculate time left
  useEffect(() => {
    if (!data?.data?.gameTime) return;

    const interval = setInterval(() => {
      const now = moment();
      const target = moment(data.data.gameTime);
      const duration = moment.duration(target.diff(now));

      if (duration.asMilliseconds() <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.data?.gameTime]);

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSetOutcome = async () => {
    if (selectedImage && data?.data?._id) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-resultImage/${data.data._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resultImage: selectedImage,
            }),
          }
        );

        if (response.ok) {
          router.push("/manage-targets");
        } else {
          console.error("Failed to update outcome image");
        }
      } catch (error) {
        console.error("Error updating outcome image:", error);
      }
    }
  };

  if (isLoading || !data) {
    return <div className="text-white text-center p-8">Loading...</div>;
  }

  const images = [
    { url: data.data.image1.url, description: data.data.image1.description },
    { url: data.data.image2.url, description: data.data.image2.description },
    { url: data.data.image3.url, description: data.data.image3.description },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-[#8F37FF] text-white p-3 rounded-md text-[28px] font-medium">
          Set Outcome
        </div>

        <div className="bg-white/5 p-6 rounded-md">
          <div className="bg-white/5 p-6 rounded-md mb-6 w-[577px]">
            <h2 className="text-white text-xl mb-4">Active Targets</h2>

            <div className="rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-white">Code: {data.data.code}</p>
                  <p className="text-white">
                    Reveal Time:{" "}
                    {moment(data.data.revealTime).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="bg-white/10 p-3 rounded-md text-center">
                  <p className="text-xs text-white mb-1">
                    Hurry up! Time ends in:
                  </p>
                  <div className="flex gap-2 text-white">
                    <div className="p-1 rounded">
                      <span className="text-lg">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </span>
                      <span className="text-xs block">Hours</span>
                    </div>
                    <span className="text-lg">:</span>
                    <div className="p-1 rounded">
                      <span className="text-lg">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </span>
                      <span className="text-xs block">Mins</span>
                    </div>
                    <span className="text-lg">:</span>
                    <div className="p-1 rounded">
                      <span className="text-lg">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </span>
                      <span className="text-xs block">Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-white text-xl mb-4">Select an image:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {images.map((image, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4">
                <div
                  className={cn(
                    "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                    selectedImage === image.url && "border-[#8F37FF]"
                  )}
                  onClick={() => handleSelectImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover"
                  />
                  {selectedImage === image.url && (
                    <div className="absolute top-2 left-2 bg-[#8F37FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                      1
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80 rounded-md px-8"
              onClick={handleSetOutcome}
              disabled={!selectedImage}
            >
              Set
            </Button>
          </div>
        </div>

        {selectedImage && (
          <div className="mt-8">
            <h2 className="text-white text-2xl text-center mb-4">
              Code: {data.data.code}
            </h2>
            <div className="border-4 border-red-500 rounded-lg overflow-hidden max-w-2xl mx-auto">
              <Image
                src={selectedImage}
                alt="Selected outcome image"
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
