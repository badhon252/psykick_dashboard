"use client";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import TableSkeleton from "@/components/shared/TableSkeleton/TableSkeleton";
import { TMCTargetsResponse } from "@/components/types/ManageTarget";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import React from "react";

const TmcInactiveTargets = () => {
  const { data, isLoading, isError, error } = useQuery<TMCTargetsResponse>({
    queryKey: ["all-un-queued-tmc-targets"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/TMCTarget/get-allUnQueuedTMCTargets`
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
      <div>
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  } else if (data && data?.data && data?.data?.length > 0) {
    content = (
      <div>
        {data?.data?.map((target, index) => (
          <ul
            key={index}
            className="bg-white/10 shadow-[0px_20px_166.2px_4px_#580EB726] my-4 border border-[#C5C5C5] rounded-[12px] p-5 grid grid-cols-4"
          >
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              {target.code}
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              <button className="text-xs font-semibold text-white leading-[120%] py-[6px] px-[22px] rounded-[4px] bg-[#2A6C2D]">
                Active
              </button>
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              <div className="w-full flex flex-col items-center justify-center">
                <span>{moment(target.revealTime).format("YYYY-MM-DD")}</span>
                <span>{moment(target.revealTime).format("HH:mm:ss")}</span>
              </div>
            </li>
            <li className="w-full flex items-center justify-center text-base font-medium text-white leading-[120%]">
              <button className="text-xs font-semibold text-white leading-[120%] py-[6px] px-[22px] rounded-[4px] bg-[#D74727]">
                Add to
              </button>
            </li>
          </ul>
        ))}
      </div>
    );
  }
  return (
    <div>
      <div className="bg-[#c4a0ff17] p-6 rounded-lg">
        {/* Inactive Targets */}
        <div>
          <div className="w-full flex items-center justify-between pb-[14px] md:pb-[20px] lg:pb-[25px] xl:pb-[30px]">
            <h2 className="text-[24px] xl:text-[28px] font-semibold leading-[120%]text-white">
              Inactive Targets
            </h2>
            <Link href="/manage-targets/tmc-queue">
              <button className="bg-gradient-to-r from-[#8F37FF] to-[#2D17FF] text-base font-semibold text-white leading-[120%] py-[20px] px-[87px] rounded-tr-[24px] rounded-bl-[24px] ">
                See Queue
              </button>
            </Link>
          </div>
          <div>
            <ul className="bg-[#ECECEC] py-[20px] grid grid-cols-4">
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
                Add to Queue
              </li>
            </ul>
          </div>
        </div>

        <div>{content}</div>
      </div>
    </div>
  );
};

export default TmcInactiveTargets;
