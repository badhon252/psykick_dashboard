import { TriangleAlert } from "lucide-react";

interface ErrorContainerProps {
  message: string;
}

const ErrorContainer = ({ message }: ErrorContainerProps) => {
  return (
    <div>
      <div className="flex h-[400px] w-full flex-col items-center justify-center bg-gray-50">
        <TriangleAlert className="text-red-500" />
        <h3 className="mt-2 text-black/70">{message}</h3>
      </div>
    </div>
  );
};

export default ErrorContainer;