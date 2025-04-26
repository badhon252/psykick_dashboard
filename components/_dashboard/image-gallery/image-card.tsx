"use client";
import { useState } from "react";
import EditImageGallery from "./edit-image-gallery";
import { CategoryImage } from "@/components/types/ImageGallery";
import Image from "next/image";
import DeleteModal from "@/components/shared/modals/DeleteModal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function ImageCard({ data }: { data?: CategoryImage }) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBhMDkyMDA0MDM1ZTdhOGNjOTc4ZTUiLCJpYXQiOjE3NDU0ODgzNzMsImV4cCI6MTc0NjA5MzE3M30.yifJ6Nn-zzQyFHGBCuXEDsk-vPazqGd55WNNNV7ZcdI";
  const queryClient = useQueryClient();

  console.log(data);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null | undefined>(
    null
  );

  console.log(data)


  const handleDeleteImageGallery = async () => {
    if (!selectedCategoryId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/delete-category/${selectedCategoryId}/${data?.imageId}/${data?.subcategoryName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Image Gallery deleted successfully!");
        setDeleteModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["all-image-gallery"] });
      } else {
        toast.error(result?.message || "Failed to delete image gallery.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete Image Gallery. Please try again.");
    }
  };

  return (
    <div className="overflow-hidden shadow-sm border border-[#C5C5C5] rounded-[12px] p-4">
      <div className="aspect-square">
        <Image
          width={304}
          height={270}
          src={data?.image || ""}
          alt="image gallery"
          className="w-full h-full object-cover rounded-[12px]"
        />
      </div>
      <div className="p-3 space-y-2">
        <h4 className="text-xl font-semibold leading-[120%] text-[#F4EBFF] text-center">
          Apparel
        </h4>
        <div className="flex justify-between items-center text-xs">
          <div>
            <div className="text-base fotn-normal text-[#F4EBFF] leading-[120%]">
              Category:
            </div>
          </div>
          <div className="text-right">
            <div className="text-base fotn-normal text-[#F4EBFF] leading-[120%]">
              {data?.categoryName}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div>
            <div className="text-base fotn-normal text-[#F4EBFF] leading-[120%]">
              Sub-category:
            </div>
          </div>
          <div className="text-right">
            <div className="text-base fotn-normal text-[#F4EBFF] leading-[120%]">
              {data?.subcategoryName}
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-primary btn text-white rounded-md px-4 py-1 text-xs font-medium flex-1 hover:bg-primary/90 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedCategoryId(data?.categoryId);
              setDeleteModalOpen(true);
            }}
            className="btn-outline rounded-md px-4 py-1 text-xs font-medium flex-1 transition-colors "
          >
            Delete
          </button>
        </div>
      </div>

      {/* edit image gallery  */}
      {isOpen && (
        <EditImageGallery
          open={isOpen}
          onOpenChange={setIsOpen}
          defaultData={data}
        />
      )}

      {/* delete modal gallery  */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteImageGallery}
        />
      )}
    </div>
  );
}
