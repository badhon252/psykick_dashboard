/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import TableSkeleton from "@/components/shared/TableSkeleton/TableSkeleton";
import { ARVActiveTargetResponse } from "@/components/types/ManageActiveTarget";
import { ARVTargetsResponse } from "@/components/types/TargetsQueueLists";
import FivosPagination from "@/components/ui/FivosPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ArvTargetsQueueLists = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // all-queued-arv-targets api
  const { data, isLoading, isError, error } = useQuery<ARVTargetsResponse>({
    queryKey: ["all-queued-arv-targets", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-allQueuedARVTargets?page=${currentPage}&limit=5&sort=-createdAt`
      ).then((res) => res.json()),
  });

  // arv Active Targets api
  const { data: arvActiveTarget } = useQuery<ARVActiveTargetResponse>({
    queryKey: ["arvActiveTargets"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-activeARVTarget`
      ).then((res) => res.json()),
  });

  console.log(arvActiveTarget?.data?._id);

  // update-ARVTarget-makeComplete api
  // const { mutate: arvMakeComplete } = useMutation({
  //   mutationKey: ["update-ARVTarget-makeComplete"],
  //   mutationFn: () =>
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-makeComplete/${arvActiveTarget?.data?._id}`,
  //       { method: "PATCH" }
  //     ).then((res) => res.json()),
  //   onSuccess: (data) => {
  //     if (!data?.status) {
  //       toast.error(data?.message || "Something went wrong");
  //       return;
  //     }
  //     toast.success(data?.message);
  //     queryClient.invalidateQueries({ queryKey: ["all-queued-arv-targets"] });
  //     queryClient.invalidateQueries({ queryKey: ["arvActiveTargets"] });
  //   },
  // });

  // update arv target make in active api
  // const { mutate: updateArvTargetMakeInActive } = useMutation({
  //   mutationKey: ["update-ARVTarget-makeInactive"],
  //   mutationFn: () =>
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-makeInactive/${arvActiveTarget?.data?._id}`,
  //       { method: "PATCH" }
  //     ).then((res) => res.json()),
  //   onSuccess: (data) => {
  //     if (!data?.status) {
  //       toast.error(data?.message || "Something went wrong");
  //       return;
  //     }
  //     toast.success(data?.message);
  //     queryClient.invalidateQueries({ queryKey: ["all-queued-arv-targets"] });
  //     queryClient.invalidateQueries({ queryKey: ["arvActiveTargets"] });
  //   },
  // });

  // Check for exceeded buffer times when component loads
  useEffect(() => {
    if (arvActiveTarget?.data) {
      const bufferTime = moment(arvActiveTarget.data.bufferTime);
      const now = moment();

      if (now.isSameOrAfter(bufferTime)) {
        console.log(
          "Found active game with exceeded buffer time, processing..."
        );
        // 1. Mark current target as complete
        // arvMakeComplete();
        // 2. Mark current target as inactive
        // updateArvTargetMakeInActive();
        // 3. Start the next game if available
        // handleARVMakeActive();
      }
    }
  }, [arvActiveTarget?.data?.bufferTime]);

  const now = moment();
  const isBufferTime = now.isSameOrAfter(arvActiveTarget?.data?.bufferTime);

  // 🔁 Check bufferTime every 5 seconds and handle game completion sequence
  useEffect(() => {
    if (!arvActiveTarget?.data?.bufferTime || !arvActiveTarget?.data?._id)
      return;

    const bufferTime = moment(arvActiveTarget.data.bufferTime);
    console.log("Buffer Time:", bufferTime.toISOString());

    // const interval = setInterval(() => {
    //   const now = moment();
    //   if (now.isSameOrAfter(bufferTime)) {
    //     clearInterval(interval);
    //     // 1. Mark current target as complete
    //     // arvMakeComplete();
    //     // 2. Mark current target as inactive
    //     // updateArvTargetMakeInActive();
    //     // 3. Start the next game if available
    //     // handleARVMakeActive();
    //   }
    // }, 5000);

    // return () => clearInterval(interval);
  }, [isBufferTime]);

  const handleARVMakeActive = async () => {
    try {
      // First check if there's any active or partially active game
      // const activeGameCheck = await fetch(
      //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-activeARVTarget`
      // ).then((res) => res.json());

      // If there's an active or partially active game, show error
      // if (activeGameCheck?.data === null) {
      //   toast.error(
      //     "There's already an active game. Please wait for it to complete."
      //   );
      //   return;
      // }

      // If no active game, proceed with starting next game
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-startNextGame`,
        { method: "PATCH" }
      );
      const data = await res.json();

      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(data?.message || "ARV Target is active now");
      queryClient.invalidateQueries({ queryKey: ["all-queued-arv-targets"] });
      queryClient.invalidateQueries({ queryKey: ["arvActiveTargets"] });
    } catch (error) {
      console.error("Error activating next game:", error);
      toast.error("Failed to activate next game");
    }
  };

  // remove-arv-from-queue api
  const { mutate } = useMutation({
    mutationKey: ["remove-arv-from-queue"],
    mutationFn: (id: string) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-removeFromQueue/${id}`,
        { method: "PATCH" }
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
      </div>
    );
  } else if (data && data?.data && data?.data?.length > 0) {
    // const currentTime = moment();
    // const activeTargets = data.data.filter((target) =>
    //   moment(target.gameTime).isAfter(currentTime)
    // );

    // Set it false to show inactive targets
    if (false) {
      content = (
        <div className="w-full flex gap-2 items-center justify-center py-10 font-bold text-[20px] text-[#b2b2b2]">
          No active ARV Targets available in queue!
        </div>
      );
    } else {
      content = (
        <div>
          {data.data.map((target, index) => (
            <ul
              key={index}
              className="bg-white/10 shadow-[0px_20px_166.2px_4px_#580EB726] my-4 border border-[#C5C5C5] rounded-[12px] p-5 grid grid-cols-6"
            >
              <li className="flex items-center justify-center text-white font-medium">
                {target.code}
              </li>
              <li className="flex items-center justify-center text-white font-medium">
                <p className="text-center text-sm">
                  {target.eventDescription || "No description available"}
                </p>
              </li>
              <li className="flex flex-col items-center justify-center text-white font-medium">
                <span>{target.revealDuration}</span>
                {/* <span>{moment(target.revealTime).format("HH:mm:ss")}</span> */}
              </li>
              <li className="flex flex-col items-center justify-center text-white font-medium">
                <span>{target.revealDuration}</span>
                {/* <span>{moment(target.gameTime).format("HH:mm:ss")}</span> */}
              </li>
              <li className="flex items-center justify-center">
                <button
                  onClick={() => handleARVMakeActive()}
                  className="text-xs font-semibold text-white py-[6px] px-[29px] rounded-[4px] bg-[#3C9682]"
                >
                  Active
                </button>
              </li>
              <li className="flex items-center justify-center">
                <button
                  onClick={() => handleArvRemoveFromQueue(target._id)}
                  className="text-xs font-semibold text-white py-[6px] px-[10px] rounded-[4px] bg-[#D74727]"
                >
                  Remove from queue
                </button>
              </li>
            </ul>
          ))}
        </div>
      );
    }
  }

  return (
    <div>
      <div className="bg-[#c4a0ff17] p-6 rounded-lg">
        <div className="w-full flex items-center justify-end pb-5">
          <Link href="/manage-targets">
            <button className="flex items-center gap-3 bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] text-base font-semibold text-white py-[15px] px-[40px] rounded-tr-[24px] rounded-bl-[24px] ">
              <ChevronLeft /> Manage Targets
            </button>
          </Link>
        </div>
        <div>
          <h3 className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] rounded-t-[20px] text-[24px] lg:text-[28px] text-white font-semibold p-5 mb-[30px]">
            ARV Targets Queue Lists
          </h3>
        </div>
        <ul className="bg-white py-[20px] grid grid-cols-6">
          <li className="flex justify-center text-[#444444] font-medium">
            Code
          </li>
          <li className="flex justify-center text-[#444444] font-medium">
            Description
          </li>
          <li className="flex justify-center text-[#444444] font-medium">
            Reveal Time
          </li>
          <li className="flex justify-center text-[#444444] font-medium">
            Game Time
          </li>
          <li className="flex justify-center text-[#444444] font-medium">
            Make Active
          </li>
          <li className="flex justify-center text-[#444444] font-medium">
            Remove From Queue
          </li>
        </ul>
        {content}
        {data && data?.pagination?.totalPages > 1 && (
          <div className="w-full flex items-center justify-between pt-10 pb-2">
            <p className="text-white text-[16px]">
              Showing {currentPage} to {data?.pagination?.totalPages} in first
              entries
            </p>
            <FivosPagination
              totalPages={data?.pagination?.totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArvTargetsQueueLists;
