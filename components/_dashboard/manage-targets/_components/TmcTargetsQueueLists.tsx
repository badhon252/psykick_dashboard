/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
// import NotFound from "@/components/shared/NotFound/NotFound";
import TableSkeleton from "@/components/shared/TableSkeleton/TableSkeleton";
import { TMCActiveTargetResponse } from "@/components/types/ManageActiveTarget";
import { TMCTargetsListResponse } from "@/components/types/TargetsQueueLists";
import FivosPagination from "@/components/ui/FivosPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const TmcTargetsQueueLists = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const queryClient = useQueryClient();
  const {
    data: tmcQueued,
    isLoading,
    isError,
    error,
  } = useQuery<TMCTargetsListResponse>({
    queryKey: ["all-queued-tmc-targets", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/get-allQueuedTMCTargets?page=${currentPage}&limit=5`
      ).then((res) => res.json()),
  });

  // tmc active target api
  const { data: tmcActiveTarget } = useQuery<TMCActiveTargetResponse>({
    queryKey: ["tmcActiveTargets"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/get-activeTMCTarget`
      ).then((res) => res.json()),
  });

  // console.log("tmcActiveTarget", tmcActiveTarget?.data?.bufferTime);

  // update-TMC Target-make Complete api
  const { mutate: tmcMakeComplete } = useMutation({
    mutationKey: ["update-TMCTarget-makeComplete"],
    mutationFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/update-TMCTarget-makeComplete/${tmcActiveTarget?.data?._id}`,
        { method: "PATCH" }
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["all-queued-tmc-targets"] });
      queryClient.invalidateQueries({ queryKey: ["tmcActiveTargets"] });
    },
  });

  // Check for exceeded buffer times when component loads
  useEffect(() => {
    if (tmcActiveTarget?.data) {
      // const bufferTime = moment(tmcActiveTarget.data.bufferTime);
      // const now = moment();

      if (tmcActiveTarget?.data?.bufferDuration === 0) {
        console.log(
          "Found active TMC game with exceeded buffer time, processing..."
        );
        // 1. Mark current target as complete
        tmcMakeComplete();
        // 2. Mark current target as inactive
        updateTmcTargetMakeInActive();
        // 3. Start the next game if available
        // handleTMCMakeActive();
      }
    }
  }, [tmcActiveTarget?.data?.bufferTime]);

  const now = moment();
  const isBufferTime = now.isSameOrAfter(tmcActiveTarget?.data?.bufferTime);

  // 🔁 Check bufferTime every 5 seconds and trigger makeComplete
  useEffect(() => {
    if (!tmcActiveTarget?.data?.bufferTime || !tmcActiveTarget?.data?._id)
      return;

    const bufferTime = moment(tmcActiveTarget.data.bufferTime);
    console.log("Buffer Time:", bufferTime.toISOString());
    const interval = setInterval(() => {
      const now = moment();
      if (now.isSameOrAfter(bufferTime)) {
        clearInterval(interval);
        // First mark the target as complete
        tmcMakeComplete();
        // Then mark it as inactive
        updateTmcTargetMakeInActive();
        // Finally start the next game if available
        // handleTMCMakeActive();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isBufferTime, tmcActiveTarget?.data?._id]);

  // update tmc target make in active api
  const { mutate: updateTmcTargetMakeInActive } = useMutation({
    mutationKey: ["update-TMCTarget-makeInactive"],
    mutationFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/update-TMCTarget-makeInactive/${tmcActiveTarget?.data?._id}`,
        { method: "PATCH" }
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["all-queued-tmc-targets"] });
      queryClient.invalidateQueries({ queryKey: ["tmcActiveTargets"] });
    },
  });

  // 🔁 Check bufferTime every 5 seconds and trigger makeComplete
  useEffect(() => {
    if (!tmcActiveTarget?.data?.bufferTime || !tmcActiveTarget?.data?._id)
      return;

    const bufferTime = moment(tmcActiveTarget.data.bufferTime);
    console.log("Buffer Time:", bufferTime.toISOString());
    const interval = setInterval(() => {
      const now = moment();
      if (now.isSameOrAfter(bufferTime)) {
        clearInterval(interval);
        updateTmcTargetMakeInActive();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [5000]);

  // update TMC Start Next Game
  const handleTMCMakeActive = () => {
    // {{baseURL}}/TMCTarget/update-startNextGame
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/update-startNextGame`,
      {
        method: "PATCH",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data?.status) {
          toast.error(data?.message || "Something went wrong");
          return;
        }
        toast.success(data?.message || "TMC Target is active now");
        queryClient.invalidateQueries({ queryKey: ["all-queued-tmc-targets"] });
        queryClient.invalidateQueries({ queryKey: ["tmcActiveTargets"] });
      });

    console.log(tmcActiveTarget);
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
  } else if (tmcQueued && tmcQueued?.data && tmcQueued?.data?.length === 0) {
    content = (
      <div className="w-full flex gap-2 items-center justify-center py-10 font-bold text-[20px] text-[#b2b2b2]">
        No TMC Target available in queue, please add TMC Target to queue!
        {/* <NotFound message="Oops! No data available. Modify your filters or check your internet connection." /> */}
      </div>
    );
  } else if (tmcQueued && tmcQueued?.data && tmcQueued?.data?.length > 0) {
    // const currentTime = moment();
    const activeTargets = tmcQueued.data;
    console.log("Active Targets:", activeTargets);

    if (activeTargets.length === 0) {
      content = (
        <div className="w-full flex gap-2 items-center justify-center py-10 font-bold text-[20px] text-[#b2b2b2]">
          No active TMC Targets available in queue!
        </div>
      );
    } else {
      content = (
        <div className="">
          {activeTargets.map((target, index) => (
            <ul
              key={index}
              className="bg-white/10 shadow-[0px_20px_166.2px_4px_#580EB726] my-4 border border-[#C5C5C5] rounded-[12px] p-5 grid grid-cols-5"
            >
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                {target.code}
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <div className="w-full flex flex-col items-center justify-center">
                  <span>{target.revealDuration} Minutes</span>
                  {/* <span>{moment(target.revealTime).format("HH:mm:ss")}</span> */}
                </div>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <div className="w-full flex flex-col items-center justify-center">
                  <span>{target.gameDuration} Minutes</span>
                  {/* <span>{moment(target.gameTime).format("HH:mm:ss")}</span> */}
                </div>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <button
                  className={`text-xs font-semibold text-white leading-[120%] py-[6px] px-[29px] rounded-[4px] bg-[#3C9682] ${
                    tmcActiveTarget?.data?._id !== target._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => handleTMCMakeActive()}
                  disabled={tmcActiveTarget?.data !== null}
                >
                  Active
                </button>
              </li>
              <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
                <button
                  onClick={() => handleTmcRemoveFromQueue(target?._id)}
                  className="text-xs font-semibold text-white leading-[120%] py-[6px] px-[10px] rounded-[4px] bg-[#D74727]"
                >
                  Remove
                </button>
              </li>
            </ul>
          ))}
        </div>
      );
    }
  }

  // Remove from queue TMC

  const { mutate } = useMutation({
    mutationKey: ["remove-from-queue-tmc"],
    mutationFn: (id: string) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/update-TMCTarget-removeFromQueue/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ["all-queued-tmc-targets"] });
    },
  });
  const handleTmcRemoveFromQueue = (id: string) => {
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
            TMC Targets Queue Lists
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
          {tmcQueued &&
            tmcQueued?.pagination &&
            tmcQueued?.pagination?.totalPages > 1 && (
              <div className="w-full flex items-center justify-between pt-10 pb-2">
                <p className="font-normal text-[16px] leading-[20px] text-white">
                  Showing {currentPage} to {tmcQueued?.pagination?.totalPages}{" "}
                  in first entries
                </p>
                <div>
                  <FivosPagination
                    totalPages={tmcQueued?.pagination?.totalPages}
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

export default TmcTargetsQueueLists;
