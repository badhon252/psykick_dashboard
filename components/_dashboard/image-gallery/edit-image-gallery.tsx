"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formSchema = z.object({
  categoryName: z.string().min(1, "Category is required"),
  subCategoryName: z.string().min(1, "Sub-category is required"),
  image: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

import { Dialog, DialogContent } from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/ImageUpload";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";

const EditImageGallery = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [image, setImage] = useState<File | null>(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBhMDkyMDA0MDM1ZTdhOGNjOTc4ZTUiLCJpYXQiOjE3NDU0ODgzNzMsImV4cCI6MTc0NjA5MzE3M30.yifJ6Nn-zzQyFHGBCuXEDsk-vPazqGd55WNNNV7ZcdI";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      subCategoryName: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-category"],
    mutationFn: (formData: FormData) =>
      fetch(`http://localhost:5001/api/v1/category/upload-category-image`, {
        method: "POST",
        headers: {
        //   "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json()),
  });

  const onSubmit = (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("categoryName", values.categoryName);
    formData.append("subCategoryName", values.subCategoryName);
    if (image) {
      formData.append("image", image);
    }
    console.log("Submitted values:", formData);
    mutate(formData);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="text-black">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Category Name */}
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-[#9E9E9E] text-black">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FLOWER">FLOWER</SelectItem>
                        <SelectItem value="LMN">LMN</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sub-category */}
              <FormField
                control={form.control}
                name="subCategoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-[#9E9E9E] text-black">
                          <SelectValue placeholder="Select a sub-category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Lily">Lily</SelectItem>
                        <SelectItem value="DEF">DEF</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}

              <div>
                <Label className="text-white mb-2 block">Category Image</Label>
                <ImageUpload onImageChange={setImage} />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-purple-600 hover:bg-purple-500"
              >
                {isPending ? "Uploading..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditImageGallery;
