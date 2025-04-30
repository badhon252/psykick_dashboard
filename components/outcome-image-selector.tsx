"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OutcomeImage {
  id: string;
  src: string;
  alt: string;
  description: string;
}

interface OutcomeImageSelectorProps {
  images: OutcomeImage[];
  onSelect: (imageId: string) => void;
}

export function OutcomeImageSelector({
  images,
  onSelect,
}: OutcomeImageSelectorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedImage(id);
    onSelect(id);
  };

  const selectedImageData = selectedImage
    ? images.find((img) => img.id === selectedImage)
    : null;

  return (
    <div className="space-y-6">
      <h3 className="text-white text-xl">Select an image:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image) => (
          <div key={image.id} className="flex flex-col md:flex-row gap-4">
            <div
              className={cn(
                "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                selectedImage === image.id && "border-[#8F37FF]"
              )}
              onClick={() => handleSelect(image.id)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={200}
                height={150}
                className="w-full h-32 object-cover"
              />
              {selectedImage === image.id && (
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

      {selectedImageData && (
        <div className="mt-8">
          <h2 className="text-white text-2xl text-center mb-4">
            Code: ABC-25G
          </h2>
          <div className="border-4 border-red-500 rounded-lg overflow-hidden max-w-2xl mx-auto">
            <Image
              src={selectedImageData.src || "/placeholder.svg"}
              alt={selectedImageData.alt}
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
