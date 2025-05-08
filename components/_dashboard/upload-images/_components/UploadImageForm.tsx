"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import type { CategoryApiResponse } from "@/components/types/ImageGallery"

const uploadSchema = z.object({
  categoryName: z.string().min(1, "Category Name is required"),
  subCategoryName: z.string().min(1, "Sub-category Name is required"),
})

export default function UploadImageForm() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") || "" : ""
  const queryClient = useQueryClient()

  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      categoryName: "",
      subCategoryName: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // get category and subCategory
  const { data } = useQuery<CategoryApiResponse>({
    queryKey: ["all-category-subCategory"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-category-and-subcategory-names`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
  })

  const { data: subCategoryData } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/get-subcategories/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    enabled: !!selectedCategory, // Only run query when a category is selected
  })

  const subCategories = subCategoryData?.data || []

  const categoryData = data?.data || []

  const { mutate, isPending } = useMutation({
    mutationKey: ["upload-categoryName-image"],
    mutationFn: (formData: FormData) => {
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/upload-category-image`, {
        method: "POST",
        body: formData,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json())
    },
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Category Image added successfully")
        return
      } else {
        form.reset()
        toast.success(data?.message || "Failed to add Category Image")
        queryClient.invalidateQueries({ queryKey: ["all-image-gallery"] })
      }
    },
  })

  const onSubmit = (data: z.infer<typeof uploadSchema>) => {
    const formData = new FormData()

    formData.append("categoryName", data.categoryName)
    formData.append("subCategoryName", data.subCategoryName)
    if (image) {
      formData.append("image", image)
    }
    console.log("Form submitted successfully", formData)
    mutate(formData)
  }

  return (
    <Card className="bg-[#170A2C]/50 border-0">
      <CardHeader>
        <CardTitle className="text-white">Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Category Name <sup className="text-red-500 text-base">*</sup>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedCategory(value)
                      // Reset subcategory when category changes
                      form.setValue("subCategoryName", "")
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryData?.map((cat, index) => (
                        <SelectItem key={index} value={cat.categoryName}>
                          {cat.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Sub-category <sup className="text-red-500 text-base">*</sup>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                    <FormControl>
                      <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                        <SelectValue placeholder={selectedCategory ? "Select one" : "Select a category first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {subCategories?.map((subCat: string, index: number) => (
                        <SelectItem key={index} value={subCat}>
                          {subCat}
                        </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel className="text-white">Category Image</FormLabel>
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
                        setImage(null)
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
                      type="button"
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
              <Button type="submit" disabled={isPending} className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">
                {isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
