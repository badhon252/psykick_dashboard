import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface StatusBadgeProps {
  status:
    | "inactive"
    | "queued"
    | "active"
    | "revealed"
    | "expired"
    | "completed";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColorClass = (currentStatus: StatusBadgeProps["status"]) => {
    switch (currentStatus) {
      case "inactive":
        return "bg-gray-500";
      case "queued":
        return "bg-yellow-500";
      case "active":
        return "bg-teal-500"; // Using teal for active status
      case "revealed":
        return "bg-purple-500";
      case "expired":
        return "bg-red-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500"; // Default color
    }
  };

  return (
    <li
      className={cn(
        "w-full flex items-center justify-center text-base font-medium rounded-lg text-white leading-[120%]",
        getStatusColorClass(status)
      )}
    >
      {status}
    </li>
  );
}
