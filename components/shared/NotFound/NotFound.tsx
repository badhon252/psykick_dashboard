import { TextAnimate } from "@/components/magicui/text-animate";
import Image from "next/image";
import React from "react";

interface Props {
  message: string;
}

const NotFound = ({ message }: Props) => {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-white rounded-lg">
      {/* Image */}
      <Image
        src="/assets/img/404.png"
        alt="404 Not Found Illustration"
        width={300}
        height={300}
        className="mb-4 w-[250px] h-[300px]"
      />

      {/* Text Animation applied to message string only */}
      <p className="text-lg font-bold text-black text-center w-1/3">
        <TextAnimate animation="slideUp" by="word">
          {message} 
        </TextAnimate>
      </p>
    </div>
  );
};

export default NotFound;

