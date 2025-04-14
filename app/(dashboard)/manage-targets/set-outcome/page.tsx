"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import img from "@/public/assets/img/flower.png"

// Mock data for outcome images
const outcomeImages = [
  {
    id: "house1",
    src: img,
    alt: "House with garden",
    description: "This image corresponds to this. You can select the image to see if it matches.",
  },
  {
    id: "house2",
    src: img,
    alt: "Brick house",
    description: "This image corresponds to this. You can select the image to see if it matches.",
  },
  {
    id: "lotus",
    src: img,
    alt: "Lotus flower",
    description: "This image corresponds to this. You can select the image to see if it matches.",
  },
  {
    id: "ocean",
    src: img,
    alt: "Ocean view",
    description: "This image corresponds to this. You can select the image to see if it matches.",
  },
]

export default function SetOutcomePage() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>("lotus")

  const handleSelectImage = (imageId: string) => {
    setSelectedImage(imageId)
  }

  const handleSetOutcome = () => {
    if (selectedImage) {
      // In a real app, this would send the data to the server
      console.log(`Setting outcome for target to image ${selectedImage}`)
      router.push("/manage-targets")
    }
  }

  const selectedImageData = selectedImage ? outcomeImages.find((img) => img.id === selectedImage) : null

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-[#8F37FF] text-white p-3 rounded-md text-[28px] font-medium">Set Outcome</div>

        <div className="bg-white/5 p-6 rounded-md">

        <div className="bg-white/5 p-6 rounded-md mb-6 w-[577px]">
            <h2 className="text-white text-xl mb-4">Active Targets</h2>

          <div className=" rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-white">Code: ABC-25G</p>
                <p className="text-white">Reveal Time: 20/05/2026</p>
              </div>
              <div className="bg-white/10 p-3 rounded-md text-center">
                <p className="text-xs text-white mb-1">Hurry up! Time ends in:</p>
                <div className="flex gap-2 text-white">
                  <div className=" p-1 rounded">
                    <span className="text-lg">00</span>
                    <span className="text-xs block">Hours</span>
                  </div>
                  <span className="text-lg">:</span>
                  <div className=" p-1 rounded">
                    <span className="text-lg">00</span>
                    <span className="text-xs block">Mins</span>
                  </div>
                  <span className="text-lg">:</span>
                  <div className=" p-1 rounded">
                    <span className="text-lg">00</span>
                    <span className="text-xs block">Secs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
          <h3 className="text-white text-xl mb-4">Select an image:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {outcomeImages.map((image) => (
              <div key={image.id} className="flex flex-col md:flex-row gap-4">
                <div
                  className={cn(
                    "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                    selectedImage === image.id && "border-[#8F37FF]",
                  )}
                  onClick={() => handleSelectImage(image.id)}
                >
                  <Image
                    src={image.src || img}
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

          <div className="flex justify-end">
            <Button
              className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80 rounded-md px-8"
              onClick={handleSetOutcome}
            >
              Set
            </Button>
          </div>
        </div>

        {selectedImageData && (
          <div className="mt-8">
            <h2 className="text-white text-2xl text-center mb-4">Code: ABC-25G</h2>
            <div className="border-4 border-red-500 rounded-lg overflow-hidden max-w-2xl mx-auto">
              <Image
                src={selectedImageData.src || img}
                alt={selectedImageData.alt}
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
