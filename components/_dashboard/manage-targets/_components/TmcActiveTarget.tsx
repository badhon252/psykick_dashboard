"use client";

import { TMCActiveTargetResponse } from "@/components/types/ManageActiveTarget";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";

const TmcActiveTarget = () => {
  const { data, isLoading, isError, error } = useQuery<TMCActiveTargetResponse>(
    {
      queryKey: ["tmcActiveTargets"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/get-activeTMCTarget`
        ).then((res) => res.json()),
    }
  );

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!data?.data?.gameTime) return;

    const interval = setInterval(() => {
      const now = moment();
      const target = moment(data.data.gameTime);
      const duration = moment.duration(target.diff(now));

      if (duration.asMilliseconds() <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(duration.asDays());
        const hours = duration.hours(); // <-- 0 to 23 hours, correct clock style
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.data?.gameTime]);

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
                  >
                    Deactive
                  </Button>
                </div>

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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TmcActiveTarget;
