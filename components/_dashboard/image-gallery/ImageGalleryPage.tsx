"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List, Plus } from "lucide-react"
import Image from "next/image"

// Mock data for gallery images
const galleryImages = Array.from({ length: 20 }).map((_, i) => ({
  id: `img-${i}`,
  src: `/placeholder.svg?height=200&width=300`,
  alt: `Gallery image ${i}`,
  category: i % 3 === 0 ? "Nature" : i % 3 === 1 ? "Architecture" : "Abstract",
  subCategory: i % 2 === 0 ? "Landscapes" : "Closeups",
}))

export default function ImageGalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Image Gallery" />
      <main className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-[#170A2C] border-b border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
                All Images
              </TabsTrigger>
              <TabsTrigger value="nature" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
                Nature
              </TabsTrigger>
              <TabsTrigger
                value="architecture"
                className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white"
              >
                Architecture
              </TabsTrigger>
              <TabsTrigger value="abstract" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
                Abstract
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={`${viewMode === "grid" ? "bg-[#8F37FF] text-white" : "bg-[#170A2C] border-gray-700 text-white"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`${viewMode === "list" ? "bg-[#8F37FF] text-white" : "bg-[#170A2C] border-gray-700 text-white"}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search images..." className="pl-8 bg-[#170A2C] border-gray-700 text-white" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] bg-[#170A2C] border-gray-700 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="architecture">Architecture</SelectItem>
                <SelectItem value="abstract">Abstract</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-[#170A2C] border-gray-700 text-white">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardContent className="p-6">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="group relative rounded-md overflow-hidden">
                        <Image
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                          <p className="text-white text-sm">{image.category}</p>
                          <p className="text-gray-300 text-xs">{image.subCategory}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="flex items-center gap-4 p-2 hover:bg-[#170A2C] rounded-md">
                        <Image
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          width={100}
                          height={70}
                          className="w-24 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-white">{image.alt}</p>
                          <p className="text-gray-400 text-sm">
                            {image.category} / {image.subCategory}
                          </p>
                        </div>
                        <div className="ml-auto flex gap-2">
                          <Button variant="ghost" size="sm" className="text-white">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-white">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nature" className="mt-0">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardContent className="p-6">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {galleryImages
                      .filter((img) => img.category === "Nature")
                      .map((image) => (
                        <div key={image.id} className="group relative rounded-md overflow-hidden">
                          <Image
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            width={300}
                            height={200}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-white text-sm">{image.category}</p>
                            <p className="text-gray-300 text-xs">{image.subCategory}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {galleryImages
                      .filter((img) => img.category === "Nature")
                      .map((image) => (
                        <div key={image.id} className="flex items-center gap-4 p-2 hover:bg-[#170A2C] rounded-md">
                          <Image
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            width={100}
                            height={70}
                            className="w-24 h-16 object-cover rounded-md"
                          />
                          <div>
                            <p className="text-white">{image.alt}</p>
                            <p className="text-gray-400 text-sm">
                              {image.category} / {image.subCategory}
                            </p>
                          </div>
                          <div className="ml-auto flex gap-2">
                            <Button variant="ghost" size="sm" className="text-white">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="mt-0">
            {/* Similar content structure as "nature" tab */}
          </TabsContent>

          <TabsContent value="abstract" className="mt-0">
            {/* Similar content structure as "nature" tab */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
