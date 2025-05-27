"use client";
import { useState } from "react";
import EditImageGallery from "./edit-image-gallery";
import Image from "next/image";
import DeleteModal from "@/components/shared/modals/DeleteModal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";

// Updated interface to include isUsed
interface CategoryImage {
  imageId: string;
  categoryId: string;
  categoryName: string;
  subcategoryName: string;
  image: string;
  isUsed?: boolean;
}

export function ImageCard({ data }: { data?: CategoryImage }) {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  console.log(data);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | null | undefined
  >(null);

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
        // Invalidate both queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ["all-image-gallery"] });
        queryClient.invalidateQueries({ queryKey: ["used-image-gallery"] });
      } else {
        toast.error(result?.message || "Failed to delete image gallery.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete Image Gallery. Please try again.");
    }
  };

  return (
    <div className="overflow-hidden shadow-sm border border-[#C5C5C5] rounded-[12px] p-4 relative">
      {/* Used Badge */}
      {data?.isUsed && (
        <div className="absolute top-2 left-2 z-10">
          <Badge
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white font-medium text-xs px-2 py-1"
          >
            Used
          </Badge>
        </div>
      )}

      {/* Available Badge (optional - you can remove this if you only want to show "Used") */}
      {data?.isUsed === false && (
        <div className="absolute top-2 left-2 z-10">
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-600 text-white font-medium text-xs px-2 py-1"
          >
            Not Used
          </Badge>
        </div>
      )}

      <div className="aspect-square">
        <Image
          width={304}
          height={270}
          src={data?.image || ""}
          alt="image gallery"
          className={`w-full h-full object-cover rounded-[12px] `}
        />
      </div>
      <div className="p-3 space-y-2">
        <h4 className="text-xl font-semibold leading-[120%] text-[#F4EBFF] text-center">
          {data?.categoryName || "Apparel"}
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

        {/* Status indicator */}
        <div className="flex justify-between items-center text-xs">
          <div>
            <div className="text-base fotn-normal text-[#F4EBFF] leading-[120%]">
              Status:
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-base font-normal leading-[120%] ${
                data?.isUsed ? "text-red-400" : "text-green-400"
              }`}
            >
              {data?.isUsed ? "Used" : "Not Used"}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-primary btn text-white rounded-md px-4 py-1 text-xs font-medium flex-1 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            // disabled={data?.isUsed}
          >
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedCategoryId(data?.categoryId);
              setDeleteModalOpen(true);
            }}
            className="btn-outline rounded-md px-4 py-1 text-xs font-medium flex-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            // disabled={data?.isUsed}
          >
            Delete
          </button>
        </div>

        {/* Disabled state message */}
        {data?.isUsed && (
          <div className="text-xs text-gray-400 text-center mt-2">
            This image is currently being used in a game and cannot be edited or
            deleted.
          </div>
        )}
      </div>

      {/* edit image gallery  */}
      {isOpen && (
        <EditImageGallery
          open={isOpen}
          onOpenChange={setIsOpen}
          // defaultData={data}
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
