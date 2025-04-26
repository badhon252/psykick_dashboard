import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";

type Props = {
  onImageChange: (file: File | null) => void;
  defaultImageUrl?: string;
};

const ImageUpload: React.FC<Props> = ({ onImageChange, defaultImageUrl }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onImageChange(acceptedFiles[0]);
    },
    [onImageChange]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-white cursor-pointer hover:border-white transition"
    >
      <input {...getInputProps()} />
      {acceptedFiles.length > 0 || defaultImageUrl ? (
        <div className="flex flex-col items-center gap-2">
          <Image
            src={
              acceptedFiles.length > 0
                ? URL.createObjectURL(acceptedFiles[0])
                : defaultImageUrl!
            }
            alt="Preview"
            width={200}
            height={200}
            className="max-h-48 object-contain rounded-xl"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImageChange(null);
            }}
          >
            <Trash2 className="w-5 h-5 text-red-400 hover:text-red-600" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <ImageIcon className="w-10 h-10 mb-2" />
          <p>Drop your image here, or browse</p>
          <p className="text-sm text-gray-300">Jpeg, png are allowed</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
