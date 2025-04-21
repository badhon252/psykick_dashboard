import { ImageCard } from "./image-card";

export function ImageGalleryPage() {
  // Sample image data
  const images = [
    {
      id: 1,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 2,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 3,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 4,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 5,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 6,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 7,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 8,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 9,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 10,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 11,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
    {
      id: 12,
      src: "/assets/img/flower.png",
      category: "Apparel",
      subcategory: "",
      name: "Name",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pt-0 flex-1">
        <div className="bg-[#7abfff]/10 rounded-lg p-4">
          <h2 className="text-[28px] font-semibold text-white tracking-[120%] mb-4 px-2">
            Image Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
