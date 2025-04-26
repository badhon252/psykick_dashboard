import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface TableSkeletonWrapperProps {
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const TableSkeletonWrapper: React.FC<TableSkeletonWrapperProps> = ({
  width = "100%", 
  height = "320px", 
  className = "", 
  count = 1
}) => {
  return (
    <div className="grid grid-cols-4 gap-8">
      {[...Array(count)].map((_, index) => (
        <Skeleton 
          key={index} 
          className={`rounded-lg ${className}`} 
          style={{ width, height }} 
        />
      ))}
    </div>
  );
};

export default TableSkeletonWrapper;
