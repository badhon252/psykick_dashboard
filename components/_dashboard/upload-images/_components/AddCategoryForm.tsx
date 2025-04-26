"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const addCategorySchema = z.object({
  categoryName: z.string().min(1, "Category is required"),
  subCategoryName: z.string().min(1, "Sub-categoryName is required"),
});

export default function AddCategoryForm() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBhMDkyMDA0MDM1ZTdhOGNjOTc4ZTUiLCJpYXQiOjE3NDU0ODgzNzMsImV4cCI6MTc0NjA5MzE3M30.yifJ6Nn-zzQyFHGBCuXEDsk-vPazqGd55WNNNV7ZcdI";

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof addCategorySchema>>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      categoryName: "",
      subCategoryName: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-categoryName"],
    mutationFn: (data: z.infer<typeof addCategorySchema>) => {
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Category added successfully");
        return;
      } else {
        form.reset();
        toast.success(data?.message || "Failed to add Category");
        queryClient.invalidateQueries({ queryKey: ["all-image-gallery"] });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof addCategorySchema>) => {
    console.log("New categoryName:", data);
    mutate(data);
  };

  return (
    <Card className="bg-[#170A2C]/50 border-0 mt-[31px]">
      <CardHeader>
        <CardTitle className="text-white">Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write here"
                      {...field}
                      className="bg-[#170A2C] border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Sub-categoryName</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write here"
                      {...field}
                      className="bg-[#170A2C] border-gray-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                disabled={isPending}
                type="submit"
                className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
