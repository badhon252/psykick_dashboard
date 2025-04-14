"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Mock data for images
const targetImages = Array.from({ length: 15 }).map((_, i) => ({
  id: `target-${i}`,
  src: `/placeholder.svg?height=200&width=300`,
  alt: `Target image ${i}`,
}))

const controlImages = Array.from({ length: 15 }).map((_, i) => ({
  id: `control-${i}`,
  src: `/placeholder.svg?height=200&width=300`,
  alt: `Control image ${i}`,
}))

export default function CreateTMCTargetPage() {
  const [selectedTargetImage, setSelectedTargetImage] = useState<string | null>(null)
  const [selectedControlImages, setSelectedControlImages] = useState<string[]>([])
  const [showMoreTargets, setShowMoreTargets] = useState(false)
  const [showMoreControls, setShowMoreControls] = useState(false)

  const handleSelectTargetImage = (id: string) => {
    setSelectedTargetImage(id)
  }

  const handleSelectControlImage = (id: string) => {
    if (selectedControlImages.includes(id)) {
      setSelectedControlImages(selectedControlImages.filter((imgId) => imgId !== id))
    } else {
      if (selectedControlImages.length < 5) {
        setSelectedControlImages([...selectedControlImages, id])
      }
    }
  }

  const visibleTargetImages = showMoreTargets ? targetImages : targetImages.slice(0, 15)
  const visibleControlImages = showMoreControls ? controlImages : controlImages.slice(0, 15)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
         
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-white text-lg">Select Target Image(any 1):</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {visibleTargetImages.map((image) => (
                  <div
                    key={image.id}
                    className={cn(
                      "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                      selectedTargetImage === image.id && "border-[#8F37FF]",
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

            <div className="space-y-2">
              <Select>
                <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                  <SelectValue placeholder="Sub-Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowers">Flowers</SelectItem>
                  <SelectItem value="landscapes">Landscapes</SelectItem>
                  <SelectItem value="animals">Animals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-white text-lg">Select Control Images(any 5):</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {visibleControlImages.map((image) => (
                  <div
                    key={image.id}
                    className={cn(
                      "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
                      selectedControlImages.includes(image.id) && "border-[#8F37FF]",
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white">Days</label>
                <Select>
                  <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                    <SelectValue placeholder="Select Days" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }).map((_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white">Hours</label>
                <Select>
                  <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                    <SelectValue placeholder="Select Hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={`${i}`}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white">Minutes</label>
                <Select>
                  <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                    <SelectValue placeholder="Select Minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }).map((_, i) => (
                      <SelectItem key={i} value={`${i}`}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Create Target</Button>
            </div>
          </CardContent>
        </Card>

        {selectedTargetImage && (
          <div className="mt-8">
            <h2 className="text-white text-2xl text-center mb-4">Code: ABC-25G</h2>
            <div className="border-4 border-red-500 rounded-lg overflow-hidden max-w-2xl mx-auto">
              <Image
                src={targetImages.find((img) => img.id === selectedTargetImage)?.src || "/placeholder.svg"}
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
  )
}
