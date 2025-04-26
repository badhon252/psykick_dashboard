"use client";
import { useQuery } from "@tanstack/react-query";
import { ImageCard } from "./image-card";
import { CategoryImageResponse } from "@/components/types/ImageGallery";


export function ImageGalleryPage() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBhMDkyMDA0MDM1ZTdhOGNjOTc4ZTUiLCJpYXQiOjE3NDU0ODgzNzMsImV4cCI6MTc0NjA5MzE3M30.yifJ6Nn-zzQyFHGBCuXEDsk-vPazqGd55WNNNV7ZcdI";

  const { data } = useQuery<CategoryImageResponse>({
    queryKey: ["all-image-gallery"],
    queryFn: () =>
      fetch(`http://localhost:5001/api/v1/category/get-all-images`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
  });

  console.log(data?.data)

  const imageGalleryData = data?.data || [];
  console.log(imageGalleryData)
  // Sample image data
  // const images = [
  //   {
  //     id: 1,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 2,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 3,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 4,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 5,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 6,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 7,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 8,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 9,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 10,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 11,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  //   {
  //     id: 12,
  //     src: "/assets/img/flower.png",
  //     category: "Apparel",
  //     subcategory: "",
  //     name: "Name",
  //   },
  // ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pt-0 flex-1">
        <div className="bg-[#7abfff]/10 rounded-[16px] ">
          <h2 className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-[16px] text-[28px] font-semibold text-white leading-[120%] px-[40px] py-[22px]">
            Image Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] md:gap-[25px] lg:gap-[30px] mt-[4px] p-8">
            {imageGalleryData?.map((image, index) => (
              <ImageCard key={index} data={image} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
