import Image from "next/image";

interface ImageCardProps {
  image: {
    id: number;
    src: string;
    category: string;
    subcategory: string;
    name: string;
  };
}

export function ImageCard({ image }: ImageCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm">
      <div className="aspect-square relative">
        <Image
          width={200}
          height={200}
          src={image.src || "/placeholder.svg"}
          alt={image.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-purple-500 text-white  backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary">
          {image.category}
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <div>
            <div className="text-[rgba(244, 235, 255, 1)]">Category:</div>
          </div>
          <div className="text-right">
            <div className="text-[rgba(244, 235, 255, 1)]">Name</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div>
            <div className="text-[rgba(244, 235, 255, 1)]">Sub-category:</div>
          </div>
          <div className="text-right">
            <div className="text-[rgba(244, 235, 255, 1)]">Name</div>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button className="bg-primary btn text-white rounded-md px-4 py-1 text-xs font-medium flex-1 hover:bg-primary/90 transition-colors">
            Edit
          </button>
          <button className="btn-outline rounded-md px-4 py-1 text-xs font-medium flex-1 transition-colors ">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
