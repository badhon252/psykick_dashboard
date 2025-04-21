"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import Image from "next/image"

export default function UploadImagesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          <CardHeader>
            <CardTitle className="text-white">Upload Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-white">Category Name</label>
              <Select>
                <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Sub-category</label>
              <Select>
                <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowers">Flowers</SelectItem>
                  <SelectItem value="landscapes">Landscapes</SelectItem>
                  <SelectItem value="animals">Animals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Category Image</label>
              <div className="border-2 border-dashed border-gray-600 rounded-md p-6 flex flex-col items-center justify-center bg-[#170A2C]/30 min-h-[200px]">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                    width={200}
                    height={200}
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-[200px] mx-auto object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                    <p className="text-center text-gray-400 mb-4">Drop your image here, or browse</p>
                    <p className="text-center text-gray-500 text-sm">Jpeg, png are allowed</p>
                    <input
                      type="file"
                      className="hidden"
                      id="image-upload"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      className="mt-4 bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      Browse
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80" disabled={!selectedFile}>
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#170A2C]/50 border-0">
          <CardHeader>
            <CardTitle className="text-white">Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-white">Category Name</label>
              <Input placeholder="Write here" className="bg-[#170A2C] border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Sub-category</label>
              <Input placeholder="Write here" className="bg-[#170A2C] border-gray-700 text-white" />
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Save</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
