"use client";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
// import NotFound from "@/components/shared/NotFound/NotFound";
import TableSkeleton from "@/components/shared/TableSkeleton/TableSkeleton";
import { ARVTargetsResponse } from "@/components/types/TargetsQueueLists";
import FivosPagination from "@/components/ui/FivosPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ArvTargetsQueueLists = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<ARVTargetsResponse>({
    queryKey: ["all-queued-arv-targets", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-allQueuedARVTargets?page=${currentPage}&limit=5`
      ).then((res) => res.json()),
  });

  let content;
  if (isLoading) {
    content = (
      <div className="w-full py-5">
        <TableSkeleton
          count={5}
          width="100%"
          height="60px"
          className="bg-[#E6EEF6]"
        />
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || "Something went Wrong"} />
      </div>
    );
  } else if (data && data?.data && data?.data?.length === 0) {
    content = (
      <div className="w-full flex gap-2 items-center justify-center py-10 font-bold text-[20px] text-[#b2b2b2]">
        No ARV Target available in queue, please add ARV Target to queue!
        {/* <NotFound message="Oops! No data available. Modify your filters or check your internet connection." /> */}
      </div>
    );
  } else if (data && data?.data && data?.data?.length > 0) {
    content = (
      <div className="">
        {data?.data?.map((target, index) => (
          <ul
            key={index}
            className="bg-white/10 shadow-[0px_20px_166.2px_4px_#580EB726] my-4 border border-[#C5C5C5] rounded-[12px] p-5 grid grid-cols-5"
          >
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              {target.code}
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              <div className="w-full flex flex-col items-center justify-center">
                <span>{moment(target.revealTime).format("YYYY-MM-DD")}</span>
                <span>{moment(target.revealTime).format("HH:mm:ss")}</span>
              </div>
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              <div className="w-full flex flex-col items-center justify-center">
                <span>{moment(target.gameTime).format("YYYY-MM-DD")}</span>
                <span>{moment(target.gameTime).format("HH:mm:ss")}</span>
              </div>
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              <button className="text-xs font-semibold text-white leading-[120%] py-[6px] px-[29px] rounded-[4px] bg-[#3C9682]">
                Active
              </button>
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              <button
                onClick={() => handleArvRemoveFromQueue(target._id)}
                className="text-xs font-semibold text-white leading-[120%] py-[6px] px-[10px] rounded-[4px] bg-[#D74727]"
              >
                Remove from queue
              </button>
            </li>
          </ul>
        ))}
      </div>
    );
  }

  // Remove from queue ARV

  const { mutate } = useMutation({
    mutationKey: ["remove-arv-from-queue"],
    mutationFn: (id: string) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-removeFromQueue/${id}`,
        {
          method: "PATCH",
        }
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Removed from queue successfully");
      queryClient.invalidateQueries({ queryKey: ["all-queued-arv-targets"] });
    },
  });

  const handleArvRemoveFromQueue = (id: string) => {
    mutate(id);
  };
  return (
    <div>
      <div className="bg-[#c4a0ff17] p-6 rounded-lg">
        {/* header  */}
        <div className="w-full flex items-center justify-end pb-5">
          <Link href="/manage-targets">
            <button className="flex items-center gap-3 bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] text-base font-semibold text-white leading-[120%] py-[15px] px-[40px] rounded-tr-[24px] rounded-bl-[24px] ">
              <ChevronLeft /> Manage Targets
            </button>
          </Link>
        </div>
        <div>
          <h3 className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-[20px] text-[24px] lg:text-[28px] text-white font-semibold leading-[120%] p-5 mb-[30px]">
            ARV Targets Queue Lists
          </h3>
        </div>
        {/* TMC Targets queue lists*/}
        <div>
          <ul className="bg-white py-[20px] grid grid-cols-5">
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Code
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Reveal Time
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Game Time
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Make Active
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Remove From Queue
            </li>
          </ul>
        </div>

        <div>{content}</div>
        {/* pagination  */}
        <div>
          {data && data?.pagination && data?.pagination?.totalPages > 1 && (
            <div className="w-full flex items-center justify-between pt-10 pb-2">
              <p className="font-normal text-[16px] leading-[20px] text-white">
                Showing {currentPage} to {data?.pagination?.totalPages} in first
                entries
              </p>
              <div>
                <FivosPagination
                  totalPages={data?.pagination?.totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArvTargetsQueueLists;
