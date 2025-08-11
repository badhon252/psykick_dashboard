/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { CountdownTimer } from "@/components/countdown-timer";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
// import NotFound from "@/components/shared/NotFound/NotFound";
import TableSkeleton from "@/components/shared/TableSkeleton/TableSkeleton";
import { ARVTargetResponse } from "@/components/types/ManageTarget";
import { Button } from "@/components/ui/button";
import FivosPagination from "@/components/ui/FivosPagination";
import { useQuery } from "@tanstack/react-query";
// import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import StatusBadge from "./status-badge";
import { ArrowLeftIcon } from "lucide-react";

const ArvInactiveTargets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [resetLoading, setResetLoading] = useState(false);
  // const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<ARVTargetResponse>({
    queryKey: ["all-un-queued-arv-targets", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-ARVTargetWithNullResultImage?page=${currentPage}&limit=5&sort=-createdAt`
      ).then((res) => res.json()),
  });

  console.log(data?.data);

  // type TargetStatus = {
  //   text: string;
  //   bgColor: string;
  // };

  // const getTargetStatus = (target: {
  //   isCompleted: boolean;
  //   isQueued: boolean;
  //   revealTime: string | null;
  // }): TargetStatus => {
  //   const now = moment();
  //   const revealTime = target.revealTime ? moment(target.revealTime) : null;

  //   // Expired - Targets that have been revealed, and the outcome has been set
  //   if (target.isCompleted && revealTime && revealTime.isBefore(now)) {
  //     return {
  //       text: "Expired",
  //       bgColor: "#666666", // Gray
  //     };
  //   }

  //   // Revealed - Targets that have been revealed but the outcome has not been set
  //   if (!target.isCompleted && revealTime && revealTime.isBefore(now)) {
  //     return {
  //       text: "Revealed",
  //       bgColor: "#E6B32A", // Yellow/Orange
  //     };
  //   }

  //   // Queued - Targets that are created and have been added to the queue
  //   if (target.isQueued) {
  //     return {
  //       text: "Queued",
  //       bgColor: "#2A6C2D", // Green
  //     };
  //   }

  //   // Pending – Targets that are created but not yet used or queued
  //   return {
  //     text: "Pending",
  //     bgColor: "#D74727", // Red
  //   };
  // };

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
        No ARV Target available, please
        <Link
          href={"/create-arv-target"}
          className="underline hover:text-[#8F37FF]"
        >
          add ARV Target!
        </Link>{" "}
        {/* <NotFound message="Oops! No data available. Modify your filters or check your internet connection." /> */}
      </div>
    );
  } else if (data && data?.data && data?.data?.length > 0) {
    // const currentTime = moment();
    // const activeTargets = data.data.filter((target) =>
    // moment(target.gameTime).isAfter(currentTime)
    // );
    //? Set it false to show inactive targets
    if (false) {
      content = (
        <div className="w-full flex gap-2 items-center justify-center py-10 font-bold text-[20px] text-[#b2b2b2]">
          No active ARV Targets available, please{" "}
          <Link
            href={"/create-arv-target"}
            className="underline hover:text-[#8F37FF]"
          >
            Add ARV Target!
          </Link>
        </div>
      );
    } else {
      content = (
        <div>
          {[...data.data].map((target, index) => (
            <ul
              key={index}
              className="bg-white/10 shadow-[0px 20px 166.2px 4px #580EB726] my-4 border border-[#C5C5C5] rounded-[12px] p-5 grid grid-cols-6"
            >
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                {target.eventName}
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                {target.code}
              </li>
              <StatusBadge key={target._id} status={target.status as any} />
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <div className="w-full flex flex-col items-center justify-center">
                  {/* <span>
                    {target.revealTime
                      ? moment(target.revealTime).format("YYYY-MM-DD")
                      : "N/A"}
                  </span>
                  <span>
                    {target.revealTime
                      ? moment(target.revealTime).format("HH:mm:ss")
                      : ""}
                  </span> */}
                  {/* <CountdownTimer
                    endTime={
                      target.revealTime
                        ? new Date(target.revealTime)
                        : new Date()
                    }
                  /> */}
                  {target.revealDuration} minutes
                </div>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <div className="w-full flex flex-col items-center justify-center">
                  {/* <span>
                    {target.revealTime
                      ? moment(target.revealTime).format("YYYY-MM-DD")
                      : "N/A"}
                  </span>
                  <span>
                    {target.revealTime
                      ? moment(target.revealTime).format("HH:mm:ss")
                      : ""}
                  </span> */}
                  {/* <CountdownTimer
                    endTime={
                      target.outcomeTime
                        ? new Date(target.outcomeTime)
                        : new Date()
                    }
                    onComplete={() => {
                      queryClient.invalidateQueries({
                        queryKey: ["all-un-queued-tmc-targets"],
                      });
                    }}
                  /> */}
                  {target.outcomeDuration} minutes
                </div>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <Button>
                  <Link href={`/manage-targets/set-outcome/${target._id}`}>
                    set outcome
                  </Link>
                </Button>
              </li>
            </ul>
          ))}
        </div>
      );
    }
  }

  // const { mutate } = useMutation({
  //   mutationKey: ["add-arv-to-queue"],
  //   mutationFn: (id: string) =>
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-addToQueue/${id}`,
  //       { method: "PATCH" }
  //     ).then((res) => res.json()),

  //   onSuccess: (data) => {
  //     if (!data?.status) {
  //       toast.error(data?.message || "Something went wrong");
  //       return;
  //     }
  //     toast.success(data?.message || "Added to queue successfully");
  //     // queryClient.invalidateQueries({
  //     //   queryKey: ["all-un-queued-arv-targets"],
  //     // });
  //   },
  // });

  // const handleArvAddToQueue = (id: string) => {
  //   mutate(id);
  // };

  // Handler for Reset Queue button
  // const handleResetQueue = async () => {
  //   setResetLoading(true);
  //   try {
  //     const stopRes = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/stop-queue`,
  //       { method: "PATCH" }
  //     );
  //     const stopData = await stopRes.json();
  //     if (!stopData?.status)
  //       throw new Error(stopData?.message || "Failed to stop queue");

  //     const resetRes = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/reset-queue`,
  //       { method: "POST" }
  //     );
  //     const resetData = await resetRes.json();
  //     if (!resetData?.status)
  //       throw new Error(resetData?.message || "Failed to reset queue");

  //     toast.success("Queue reset successfully!");
  //     // queryClient.invalidateQueries({ queryKey: ["all-un-queued-arv-targets"] });
  //   } catch (err: any) {
  //     toast.error(err.message || "Error resetting queue");
  //   } finally {
  //     setResetLoading(false);
  //   }
  // };

  return (
    <div>
      <div className="bg-[#c4a0ff17] p-6 rounded-lg">
        {/* Inactive Targets */}
        <div>
          <div className="w-full flex items-center justify-between pb-[14px] md:pb-[20px] lg:pb-[25px] xl:pb-[30px]">
            {/* <h2 className="text-[24px] xl:text-[28px] font-semibold leading-[120%]text-white">
              Inactive Targets
            </h2> */}
            <div className="flex gap-4">
              {/* <button
                className="btn-outline text-base font-semibold text-white leading-[120%] py-[20px] px-[87px] rounded-tr-[24px] rounded-bl-[24px] disabled:opacity-60"
                onClick={handleResetQueue}
                disabled={resetLoading}
              >
                {resetLoading ? "Resetting..." : "Reset Queue"}
              </button> */}
              <Link href="/manage-targets" className="">
                <button className="flex items-center gap-3 bg-gradient text-base font-semibold text-white leading-[120%] py-[12px] px-[47px] rounded-tr-[24px] rounded-bl-[24px] ">
                  <ArrowLeftIcon /> Manage Targets
                </button>
              </Link>
            </div>
          </div>
          <ul className="bg-[#ECECEC] py-[20px] grid grid-cols-6">
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Event Name
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Code
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Status
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Reveal Time
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Outcome Time
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-[#444444] leading-[120%]">
              Action
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

export default ArvInactiveTargets;
