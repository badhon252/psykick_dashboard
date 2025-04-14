"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageSelectorProps {
  title: string
  images: { id: string; src: string; alt: string }[]
  maxSelect?: number
  onSelect?: (selectedIds: string[]) => void
  showMoreButton?: boolean
}

export function ImageSelector({ title, images, maxSelect = 1, onSelect, showMoreButton = true }: ImageSelectorProps) {
  const [selected, setSelected] = useState<string[]>([])

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else {
      if (selected.length < maxSelect) {
        setSelected([...selected, id])
      } else {
        // Replace the first selected if we're at max
        const newSelected = [...selected]
        newSelected.shift()
        newSelected.push(id)
        setSelected(newSelected)
      }
    }

    if (onSelect) {
      onSelect(selected)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent",
              selected.includes(image.id) && "border-[#8F37FF]",
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
            {selected.includes(image.id) && (
              <div className="absolute top-2 left-2 bg-[#8F37FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                {selected.indexOf(image.id) + 1}
              </div>
            )}
          </div>
        ))}
      </div>
      {showMoreButton && (
        <div className="flex justify-end">
          <Button variant="outline" className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">
            See More
          </Button>
        </div>
      )}
    </div>
  )
}
