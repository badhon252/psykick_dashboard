/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CountdownTimer } from "@/components/countdown-timer";
import type { TMCActiveTargetResponse } from "@/components/types/ManageActiveTarget";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useEffect } from "react";
import { toast } from "sonner";
// import { queryClient } from '@/lib/react-query';

const TmcActiveTarget = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<TMCActiveTargetResponse>(
    {
      queryKey: ["tmcActiveTargets"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/get-activeTMCTarget`
        ).then((res) => res.json()),
    }
  );

  // update tmc target make in active api
  const { mutate: updateTmcTargetMakeInActive } = useMutation({
    mutationKey: ["update-TMCTarget-makeInactive"],
    mutationFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/update-TMCTarget-makeInactive/${data?.data?._id}`,
        {
          method: "PATCH",
        }
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

  // update tmc target make complete api
  // const { mutate: updateTmcTargetMakeComplete } = useMutation({
  //   mutationKey: ["update-TMCTarget-makeComplete"],
  //   mutationFn: () =>
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/update-TMCTarget-makeComplete/${data?.data?._id}`,
  //       {
  //         method: "PATCH",
  //       }
  //     ).then((res) => res.json()),
  //   onSuccess: (data) => {
  //     if (!data?.status) {
  //       toast.error(data?.message || "Something went wrong");
  //       return;
  //     }
  //     toast.success(data?.message);
  //     queryClient.invalidateQueries({ queryKey: ["all-queued-tmc-targets"] });
  //     queryClient.invalidateQueries({ queryKey: ["tmcActiveTargets"] });
  //   },
  // });

  // Handle deactivation by calling both APIs
  const handleDeactivate = async () => {
    try {
      // First call the makeComplete API
      // await updateTmcTargetMakeComplete();
      // Then call the makeInactive API
      updateTmcTargetMakeInActive();
    } catch (error) {
      toast.error("Failed to deactivate target");
      console.error("Deactivation error:", error);
    }
  };

  // const now = moment();
  // const isBufferTime = now.isSameOrAfter(data?.data?.bufferTime);

  useEffect(() => {
    // console.log("hello");
    if (data?.data?.bufferDuration === 0) {
      console.log("Buffer time exceeded, making next target active...");
      updateTmcTargetMakeInActive();
    } else {
      console.log("Buffer time not exceeded");
    }
  }, [updateTmcTargetMakeInActive]);
  console.log("Buffer time exceeded, making next target active...");

  // const [timeLeft, setTimeLeft] = useState({
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // });

  // useEffect(() => {
  //   if (!data?.data?.gameTime) return;

  //   const interval = setInterval(() => {
  //     const now = moment();
  //     const target = moment(data.data.gameTime);
  //     const duration = moment.duration(target.diff(now));

  //     if (duration.asMilliseconds() <= 0) {
  //       clearInterval(interval);
  //       setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  //     } else {
  //       const days = Math.floor(duration.asDays());
  //       const hours = duration.hours(); // <-- 0 to 23 hours, correct clock style
  //       const minutes = duration.minutes();
  //       const seconds = duration.seconds();

  //       setTimeLeft({ days, hours, minutes, seconds });
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [data?.data?.gameTime]);

  if (isLoading) {
    return <p className="text-white">Loading...</p>;
  }

  if (isError) {
    return <p className="text-white">Error: {error.message}</p>;
  }

  return (
    <div>
      <div className="bg-[#fffbfb12] my-[30px] p-10 rounded-lg">
        <h2 className="text-white text-[28px] font-semibold leading-[120%] mb-[30px]">
          Active Targets
        </h2>

        <div>
          {data?.data && (
            <div className="rounded-lg p-4 bg-white/10 w-[577px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl">
                <div>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%]">
                    Code: {data.data.code}
                  </p>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%] py-4">
                    Reveal Time:{" "}
                    {moment(data.data.revealTime).format("YYYY / MM / DD")}
                  </p>

                  <Button
                    size="sm"
                    className="rounded-sm bg-red-600 hover:bg-red-700 text-white my-2"
                    onClick={handleDeactivate}
                  >
                    Deactive
                  </Button>
                </div>

                <div className="p-3 rounded-md text-center bg-white/20">
                  <p className="text-base text-[#C5C5C5] font-normal leading-[120%] mb-1">
                    Hurry up! Time ends in:
                  </p>

                  <CountdownTimer
                    endTime={
                      new Date(
                        new Date(data.data.startTime).getTime() +
                          (data.data.gameDuration + data.data.revealDuration) *
                            60 *
                            1000
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TmcActiveTarget;
