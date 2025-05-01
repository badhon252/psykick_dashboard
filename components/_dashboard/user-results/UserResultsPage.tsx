/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import vector1 from "@/public/assets/img/Vector1.png";
import vector2 from "@/public/assets/img/vector2.png";
import vector3 from "@/public/assets/img/vector3.png";

export default function Leaderboard() {
  const token = localStorage.getItem("token");
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODBhNGIzYzk2ZDMyMDRmMjJiYjBlMGIiLCJpYXQiOjE3NDU1NzUyMDAsImV4cCI6MTc0NjE4MDAwMH0.4gfZW_rwIzEuzl6IAa6L_v8ptyw9_h0Jdhow0cYrj7I";

  const {
    data: comdaind,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["combined"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard/get-totalLeaderboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch combined leaderboard");
      }

      return res.json();
    },
    enabled: !!token, // ✅ Optional: wait until token is available
  });

  const combinedLeaderboard = comdaind?.data || [];

  const { data: arvData } = useQuery({
    queryKey: ["arvResult"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard/get-ARVLeaderboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch ARV leaderboard");
      }

      return res.json();
    },
    enabled: !!token,
  });
  const ARVLeaderboard = arvData?.data || [];

  const { data: tmcData } = useQuery({
    queryKey: ["tmcResult"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard/get-TMCLeaderboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch TMC leaderboard");
      }

      return res.json();
    },
    enabled: !!token,
  });

  const TMCLeaderboard = tmcData?.data || [];

  if (isLoading) {
    return <p>Loading...</p>; // You can show a loader or skeleton here.
  }

  if (isError) {
    return (
      <p>Error: {error instanceof Error ? error.message : "Unknown error"}</p>
    );
  }

  return (
    <div className="mx-auto p-4">
      {/* Combined Leaderboard */}
      <div className="col-span-2">
        <div className="bg-[#8a2be2] rounded-t-lg p-4 flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a2be2] mr-3">
            <Image
              src={vector1}
              width={100}
              height={100}
              alt="logo_iamge"
              className="w-full h-full"
            />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Combined Leaderboard
          </h2>
        </div>

        <div className="bg-[#FFFFFF1A] rounded-b-lg overflow-hidden pb-10">
          <div className="w-[95%] mx-auto mt-[20px]">
            <div className="grid grid-cols-4 text-center py-2 border-b border-gray-200 h-[59px] bg-[#F4EBFF] items-center">
              <div className="text-gray-600 font-medium">Rank</div>
              <div className="text-gray-600 font-medium text-left pl-4">
                Profile
              </div>
              <div className="text-gray-600 font-medium">RV Tier</div>
              <div className="text-gray-600 font-medium">Score</div>
            </div>

            <div className="max-h-[500px] overflow-y-auto relative space-y-4 mt-4">
              {combinedLeaderboard
                .filter((entry: any) => !entry.isCurrentUser)
                .map((entry: any, idx: number) => (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-4 items-center text-center py-3 bg-[#FFFFFF1A] rounded-md border ${
                      (entry.rank, entry.isCurrentUser)
                    }`}
                  >
                    <div className="font-bold text-white">{idx + 1}</div>
                    <div className="flex items-center text-left">
                      <div>
                        <div className="font-medium text-white">
                          {entry.user.fullName}
                        </div>
                        <div className="text-xs text-white/70">
                          @{entry.user.screenName}
                        </div>
                      </div>
                    </div>
                    <div className="text-white">{entry.tierRank}</div>
                    <div className="font-bold text-white">
                      {entry.totalPoints}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* TMC Leaderboard */}
        <div className="rounded-b-lg overflow-hidden">
          <div className="bg-[#e0d0ff] rounded-t-lg p-4 flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
              <Image
                src={vector2}
                width={100}
                height={100}
                alt="logo_iamge"
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold text-[#3a1c6e]">
              TMC Leaderboard
            </h2>
          </div>

          <div className="bg-[#FFFFFF1A] rounded-b-lg overflow-hidden pb-6">
            <div className="w-[90%] mx-auto">
              <div className="grid grid-cols-4 text-center py-2 border-b border-gray-200 h-[59px] items-center bg-[#ECECEC] mt-[31px]">
                <div className="text-gray-600 font-medium">Rank</div>
                <div className="text-gray-600 font-medium text-left pl-4">
                  Profile
                </div>
                <div className="text-gray-600 font-medium">RV Tier</div>
                <div className="text-gray-600 font-medium">Score</div>
              </div>

              <div className="max-h-[500px] overflow-y-auto relative space-y-4 mt-4">
                {TMCLeaderboard.filter(
                  (entry: any) => !entry.isCurrentUser
                ).map((entry: any, idx: number) => (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-4 items-center text-center py-3 bg-[#FFFFFF1A] rounded-md border ${
                      (entry.rank, entry.isCurrentUser)
                    }`}
                  >
                    <div className="font-bold text-white">{idx + 1}</div>
                    <div className="flex items-center text-left">
                      <div>
                        <div className="font-medium text-white">
                          {entry.user.fullName}
                        </div>
                        <div className="text-xs text-white/70">
                          @{entry.user.screenName}
                        </div>
                      </div>
                    </div>
                    <div className="text-white">{entry.tierRank}</div>
                    <div className="font-bold text-white">
                      {entry.totalTMCPoints}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ARV Leaderboard */}
        <div>
          <div className="bg-[#9186FF] rounded-t-lg p-4 flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
              <Image
                src={vector3}
                width={100}
                height={100}
                alt="logo_iamge"
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold text-[#3a1c6e]">
              ARV Leaderboard
            </h2>
          </div>

          <div className="bg-[#FFFFFF1A] rounded-b-lg overflow-hidden pb-6">
            <div className="w-[90%] mx-auto">
              <div className="grid grid-cols-4 text-center py-2 border-b border-gray-200 h-[59px] items-center mt-[31px] bg-[#ECECEC]">
                <div className="text-gray-600 font-medium">Rank</div>
                <div className="text-gray-600 font-medium text-left pl-4">
                  Profile
                </div>
                <div className="text-gray-600 font-medium">RV Tier</div>
                <div className="text-gray-600 font-medium">Score</div>
              </div>

              <div className="max-h-[500px] overflow-y-auto relative space-y-4 mt-4">
                {ARVLeaderboard.filter(
                  (entry: any) => !entry.isCurrentUser
                ).map((entry: any, idx: number) => (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-4 items-center text-center py-3 bg-[#FFFFFF1A] rounded-md border ${
                      (entry.rank, entry.isCurrentUser)
                    }`}
                  >
                    <div className="font-bold text-white">{idx + 1}</div>
                    <div className="flex items-center text-left">
                      <div>
                        <div className="font-medium text-white">
                          {entry.user.fullName}
                        </div>
                        <div className="text-xs text-white/70">
                          @{entry.user.screenName}
                        </div>
                      </div>
                    </div>
                    <div className="text-white">{entry.tierRank}</div>
                    <div className="font-bold text-white">
                      {entry.totalARVPoints}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
