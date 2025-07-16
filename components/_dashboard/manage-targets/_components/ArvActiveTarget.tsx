/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CountdownTimer } from "@/components/countdown-timer";
import { ARVActiveTargetResponse } from "@/components/types/ManageActiveTarget";
import { Button } from "@/components/ui/button";
// import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
// import moment from "moment";
import Link from "next/link";
// import Link from "next/link";
import React from "react";

const ArvActiveTarget = () => {
  const { data, isLoading, isError, error } = useQuery<ARVActiveTargetResponse>(
    {
      queryKey: ["arvActiveTargets"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-activeARVTarget`
        ).then((res) => res.json()),
    }
  );

  // const [timeLeft, setTimeLeft] = useState({
  //   days: 0,
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // });

  // const [isOutcomeTimeReached, setIsOutcomeTimeReached] = useState(false);
  // const now = moment();
  // const isRevealTime = now.isSameOrAfter(data?.data?.revealTime);
  // const isOutcomeTime = now.isSameOrBefore(String(data?.data?.outcomeTime));

  // const isRevealTime = now.isSameOrAfter(data?.data?.revealTime);

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
            <div className="rounded-lg p-4 bg-white/10 min-w-[756px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl">
                <div>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%]">
                    Event Name: {data.data.eventName}
                  </p>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%] pt-4">
                    Code: {data.data.code}
                  </p>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%] py-4">
                    Reveal Time:{" "}
                    {/* {moment(String(data.data.outcomeTime)).format(
                      "YYYY / MM / DD"
                    )} */}
                  </p>
                </div>
                <div className="p-3 rounded-md text-center bg-white/20">
                  <p className="text-base text-[#C5C5C5] font-normal leading-[120%] mb-1">
                    Hurry up! Time ends in:
                  </p>

                  <CountdownTimer
                    endTime={
                      new Date(
                        new Date(data.data.gameTime).getTime() +
                          (data.data.outcomeDuration +
                            data.data.revealDuration) *
                            60 *
                            1000
                      )
                    }
                  />
                </div>
                <div className="w-full flex items-center justify-end">
                  {data.data.revealDuration > 0 && (
                    <Link href={`/manage-targets/set-outcome/${data.data._id}`}>
                      <Button className="text-xs font-semibold leading-[120%] bg-[#8F37FF] hover:bg-[#9333EA] text-white mt-4 py-3 px-6 rounded-1">
                        Set Outcome
                      </Button>
                    </Link>
                  )}
                </div>

                {/* <div>
                  <div className="p-3 rounded-md text-center bg-white/20">
                    <p className="text-base text-[#C5C5C5] font-normal leading-[120%] mb-1">
                      Hurry up! Time ends in:
                    </p>

                    <div className="flex gap-2 text-white justify-center">
                      {timeLeft.days > 0 && (
                        <>
                          <div className="p-1 rounded">
                            <span className="text-xl font-medium leading-[120%] text-white">
                              {String(timeLeft.days).padStart(2, "0")}
                            </span>
                            <span className="block text-sm font-normal text-[#C5C5C5] leading-[120%]">
                              Days
                            </span>
                          </div>
                          <span className="text-xl font-medium leading-[120%] text-white">
                            :
                          </span>
                        </>
                      )}
                      <div className="p-1 rounded">
                        <span className="text-xl font-medium leading-[120%] text-white">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                        <span className="block text-sm font-normal text-[#C5C5C5] leading-[120%]">
                          Hours
                        </span>
                      </div>
                      <span className="text-xl font-medium leading-[120%] text-white">
                        :
                      </span>
                      <div className="p-1 rounded">
                        <span className="text-xl font-medium leading-[120%] text-white">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                        <span className="block text-sm font-normal text-[#C5C5C5] leading-[120%]">
                          Mins
                        </span>
                      </div>
                      <span className="text-xl font-medium leading-[120%] text-white">
                        :
                      </span>
                      <div className="p-1 rounded">
                        <span className="text-xl font-medium leading-[120%] text-white">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                        <span className="block text-sm font-normal text-[#C5C5C5] leading-[120%]">
                          Secs
                        </span>
                      </div>
                    </div>
                  </div>

                  
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArvActiveTarget;
