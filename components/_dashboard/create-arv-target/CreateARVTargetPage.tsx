// @typescript-eslint/no-explicit-any
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// ✅ Define proper type instead of using `any`
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
      alert(res.ok ? "ARV Target created successfully!" : `Error: ${data.message || "Failed"}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Check console for details.");
    }
  };

  const { data: imageAll, isLoading, isError } = useQuery({
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
  const selectedUrls = images.map((img) => img.url);

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
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showTimePicker ? "rotate-180" : ""
                  }`}
                />
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showTimePicker ? "rotate-180" : ""}`}
                />
              </Button>

              {showTimePicker && (
                <div className="space-y-4 mt-4">
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
                <h3 className="text-white">Image-{index + 1}</h3>

                <div className="space-y-2">
                  <Select
                    onValueChange={(value) => {
                      const updated = [...images];
                      updated[index].url = value;
                      setImages(updated);
                    }}
                  >
                    <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                      <SelectValue placeholder="Choose Image" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading">Loading images...</SelectItem>
                      ) : isError ? (
                        <SelectItem value="error">Error loading images</SelectItem>
                      ) : allImageHere.length === 0 ? (
                        <SelectItem value="empty">No images available</SelectItem>
                      ) : (
                        allImageHere.map((img: ImageOption) => {
                          const usedElsewhere = images.some(
                            (other, i) => i !== index && other.url === img.image
                          );
                          return (
                            <SelectItem
                              key={img.imageId}
                              value={img.image}
                              disabled={usedElsewhere}
                            >
                              {img.categoryName} - {img.subcategoryName}
                            </SelectItem>
                          );
                        })
                      )}
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
                      const updated = [...images];
                      updated[index].description = e.target.value;
                      setImages(updated);
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Control Image */}
            <div className="space-y-4">
              <h3 className="text-white">Control Image</h3>
              <Select onValueChange={setControlImage}>
                <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                  <SelectValue placeholder="Choose Image" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading">Loading images...</SelectItem>
                  ) : isError ? (
                    <SelectItem value="error">Error loading images</SelectItem>
                  ) : allImageHere.length === 0 ? (
                    <SelectItem value="empty">No images available</SelectItem>
                  ) : (
                    allImageHere.map((img: ImageOption) => (
                      <SelectItem
                        key={img.imageId}
                        value={img.image}
                        disabled={selectedUrls.includes(img.image)}
                      >
                        {img.categoryName} - {img.subcategoryName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
