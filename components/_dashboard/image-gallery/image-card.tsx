"use client";
import { useState } from "react";
import EditImageGallery from "./edit-image-gallery";
import { CategoryImage } from "@/components/types/ImageGallery";
import Image from "next/image";

export function ImageCard({ data }: { data?: CategoryImage }) {
  console.log(data)
  const [isOpen, setIsOpen] = useState(false);

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
          <button className="btn-outline rounded-md px-4 py-1 text-xs font-medium flex-1 transition-colors ">
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
    </div>
  );
}
