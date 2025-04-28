"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"

export default function CreateARVTargetPage() {
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [revealDate, setRevealDate] = useState("")
  const [revealTime, setRevealTime] = useState("")
  const [outcomeDate, setOutcomeDate] = useState("")
  const [outcomeTime, setOutcomeTime] = useState("")
  const [controlImage, setControlImage] = useState("")
  const [token, setToken] = useState("")
  const [images, setImages] = useState([
    { id: 1, description: "", url: "" },
    { id: 2, description: "", url: "" },
    { id: 3, description: "", url: "" },
  ])

  // Token load from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!token) {
      alert("User not authenticated! Please log in again.");
      return;
    }

    const formattedRevealTime = revealDate && revealTime ? `${revealDate}T${revealTime}:00` : "";
    const formattedOutcomeTime = outcomeDate && outcomeTime ? `${outcomeDate}T${outcomeTime}:00` : "";

    const payload = {
      eventName,
      eventDescription,
      revealTime: formattedRevealTime,
      outcomeTime: formattedOutcomeTime,
      controlImage,
      image1: images[0],
      image2: images[1],
      image3: images[2],
    }

    console.log("Submitting form with data:", payload);

    try {
      const response = await fetch("NEXT_PUBLIC_BACKEND_URL/ARVTarget/create-ARVTarget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        alert("ARV Target created successfully!");
      } else {
        alert(`Error: ${data.message || "Failed to create target"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while creating the target. Please check the console for details.");
    }
  }

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

            {/* Time Picker */}
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
                <div className="space-y-4 mt-4">
                  {/* Reveal Date and Time */}
                  <div className="space-y-2">
                    <label className="text-sm text-white">Reveal Date:</label>
                    <Input
                      type="date"
                      className="bg-[#170A2C] border-gray-700 text-white"
                      value={revealDate}
                      onChange={(e) => setRevealDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white">Reveal Time:</label>
                    <Input
                      type="time"
                      className="bg-[#170A2C] border-gray-700 text-white"
                      value={revealTime}
                      onChange={(e) => setRevealTime(e.target.value)}
                    />
                  </div>

                  {/* Outcome Date and Time */}
                  <div className="space-y-2">
                    <label className="text-sm text-white">Outcome Date:</label>
                    <Input
                      type="date"
                      className="bg-[#170A2C] border-gray-700 text-white"
                      value={outcomeDate}
                      onChange={(e) => setOutcomeDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white">Outcome Time:</label>
                    <Input
                      type="time"
                      className="bg-[#170A2C] border-gray-700 text-white"
                      value={outcomeTime}
                      onChange={(e) => setOutcomeTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Images Section */}
            {images.map((image, index) => (
              <div key={image.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white">Image-{index + 1}</h3>
                </div>
                <div className="space-y-2">
                  <Select
                    onValueChange={(value) => {
                      const updatedImages = [...images]
                      updatedImages[index].url = value
                      setImages(updatedImages)
                    }}
                  >
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

            {/* Control Image */}
            <div className="space-y-4">
              <h3 className="text-white">Control Image</h3>
              <div className="space-y-2">
                <Select onValueChange={(value) => setControlImage(value)}>
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

            {/* Submit Button */}
            <div className="flex justify-start">
              <Button
                className="btn h-[59px]"
                onClick={handleSubmit}
              >
                Create Target
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
