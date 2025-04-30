"use client";

import { ARVActiveTargetResponse } from "@/components/types/ManageActiveTarget";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const queryClient = new QueryClient();

const ArvActiveTarget = () => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useQuery<ARVActiveTargetResponse>(
    {
      queryKey: ["arvActiveTargets"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/get-activeARVTarget`
        ).then((res) => res.json()),
    }
  );

  const { mutate: updateResultImage } = useMutation({
    mutationFn: async ({
      id,
      resultImage,
    }: {
      id: string;
      resultImage: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ARVTarget/update-ARVTarget-resultImage/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resultImage }),
        }
      );
      return response.json();
    },
    onSuccess: (response) => {
      if (response.status) {
        toast.success("Result image updated successfully");
        queryClient.invalidateQueries({ queryKey: ["arvActiveTargets"] });
      } else {
        toast.error(response.message || "Failed to update result image");
      }
    },
    onError: () => {
      toast.error("Failed to update result image");
    },
  });

  const handleResultImageSelect = (imageUrl: string) => {
    if (data?.data?._id) {
      updateResultImage({ id: data.data._id, resultImage: imageUrl });
    }
  };

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
        <div className="flex justify-between items-center mb-[30px]">
          <h2 className="text-white text-[28px] font-semibold leading-[120%]">
            Active Targets
          </h2>
          <Button
            onClick={() => router.push("/manage-targets/set-outcome")}
            className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80"
          >
            Set Outcome
          </Button>
        </div>

        <div>
          {data?.data && (
            <div className="rounded-lg p-4 bg-white/10 w-[756px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl">
                <div>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%]">
                    Event Name: {data?.data?.eventName}
                  </p>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%] pt-4">
                    Code: {data.data.code}
                  </p>
                  <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%] py-4">
                    Reveal Time:{" "}
                    {moment(data.data.revealTime).format("YYYY / MM / DD")}
                  </p>
                  {/* <p className="text-[#ECECEC] text-[20px] 3xl:text-[24px] font-medium leading-[120%]">
                    Outcome Time:{" "}
                    {data?.data?.outcomeTime &&
                    typeof data.data.outcomeTime === "string"
                      ? moment(data?.data?.outcomeTime).format(
                          "YYYY / MM / DD HH:mm:ss"
                        )
                      : ""}
                  </p> */}

                  <div className="my-4">
                    <h3 className="text-[#ECECEC] text-[18px] font-medium mb-2">
                      Select Outcome Image:
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={`cursor-pointer p-2 rounded ${
                          data.data.resultImage === data.data.image1.url
                            ? "border-2 border-blue-500"
                            : "border border-gray-400"
                        }`}
                        onClick={() =>
                          handleResultImageSelect(data.data.image1.url)
                        }
                      >
                        <Image
                          width={100}
                          height={100}
                          src={data.data.image1.url}
                          alt={data.data.image1.description}
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-[#C5C5C5] mt-1">
                          {data.data.image1.description}
                        </p>
                      </div>
                      <div
                        className={`cursor-pointer p-2 rounded ${
                          data.data.resultImage === data.data.image2.url
                            ? "border-2 border-blue-500"
                            : "border border-gray-400"
                        }`}
                        onClick={() =>
                          handleResultImageSelect(data.data.image2.url)
                        }
                      >
                        <Image
                          src={data.data.image2.url}
                          alt={data.data.image2.description}
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-[#C5C5C5] mt-1">
                          {data.data.image2.description}
                        </p>
                      </div>
                      <div
                        className={`cursor-pointer p-2 rounded ${
                          data.data.resultImage === data.data.image3.url
                            ? "border-2 border-blue-500"
                            : "border border-gray-400"
                        }`}
                        onClick={() =>
                          handleResultImageSelect(data.data.image3.url)
                        }
                      >
                        <Image
                          src={data.data.image3.url}
                          alt={data.data.image3.description}
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-[#C5C5C5] mt-1">
                          {data.data.image3.description}
                        </p>
                      </div>
                    </div>
                  </div>

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

export default ArvActiveTarget;
