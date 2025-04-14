"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarTimePicker } from "@/components/calendar-time-picker"
import { ChevronDown } from "lucide-react"

export default function CreateARVTargetPage() {
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [images, setImages] = useState([
    { id: 1, description: "" },
    { id: 2, description: "" },
    { id: 3, description: "" },
  ])
  // const [controlImage, setControlImage] = useState({ description: "" })

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          <CardHeader>
            <CardTitle className="text-white">Create ARV Target</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-white">Event Name:</label>
              <Input placeholder="Write Event Name" className="bg-[#170A2C] border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Event Description:</label>
              <Textarea
                placeholder="Write Event Description"
                className="bg-[#170A2C] border-gray-700 text-white min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between bg-[#170A2C] border-gray-700 text-white"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <span>Set Time</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showTimePicker ? "rotate-180" : ""}`} />
              </Button>

              {showTimePicker && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CalendarTimePicker title="Reveal Time" />
                  <CalendarTimePicker title="Outcome Time" />
                </div>
              )}
            </div>

            {images.map((image, index) => (
              <div key={image.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white">Image-{index + 1}</h3>
                </div>
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                      <SelectValue placeholder="Choose Image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image1">Image 1</SelectItem>
                      <SelectItem value="image2">Image 2</SelectItem>
                      <SelectItem value="image3">Image 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white">Description</label>
                  <Textarea
                    placeholder={`Write image-${index + 1} description`}
                    className="bg-[#170A2C] border-gray-700 text-white"
                    value={image.description}
                    onChange={(e) => {
                      const newImages = [...images]
                      newImages[index].description = e.target.value
                      setImages(newImages)
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="space-y-4">
              <h3 className="text-white">Control Image</h3>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                    <SelectValue placeholder="Choose Image" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="control1">Control Image 1</SelectItem>
                    <SelectItem value="control2">Control Image 2</SelectItem>
                    <SelectItem value="control3">Control Image 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Create Target</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
