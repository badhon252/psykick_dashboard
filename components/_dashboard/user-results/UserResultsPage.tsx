/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import vector1 from "@/public/assets/img/Vector1.png";
import vector2 from "@/public/assets/img/vector2.png";
import vector3 from "@/public/assets/img/vector3.png";

export default function Leaderboard() {
  const [token, setToken] = useState<string | null>(null);

  // Handle token retrieval on client side to avoid hydration issues
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const {
    data: combinedData,
    isLoading: isCombinedLoading,
    isError: isCombinedError,
    error: combinedError,
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
    enabled: !!token,
  });

  const {
    data: arvData,
    isLoading: isArvLoading,
    isError: isArvError,
    error: arvError,
  } = useQuery({
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

  const {
    data: tmcData,
    isLoading: isTmcLoading,
    isError: isTmcError,
    error: tmcError,
  } = useQuery({
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

  const combinedLeaderboard = combinedData?.data || [];
  const ARVLeaderboard = arvData?.data || [];
  const TMCLeaderboard = tmcData?.data || [];

  // Loading skeleton component
  const LeaderboardSkeleton = () => (
    <div className="space-y-4 mt-4">
      {[...Array(5)].map((_, idx) => (
        <div
          key={idx}
          className="grid grid-cols-4 items-center text-center py-3 bg-[#FFFFFF1A] rounded-md"
        >
          <Skeleton className="h-4 w-8 mx-auto bg-gray-600" />
          <div className="flex items-center text-left">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-600" />
              <Skeleton className="h-3 w-16 bg-gray-600" />
            </div>
          </div>
          <Skeleton className="h-4 w-16 mx-auto bg-gray-600" />
          <Skeleton className="h-4 w-12 mx-auto bg-gray-600" />
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorMessage = ({ error }: { error: Error | null }) => (
    <div className="text-red-400 text-center font-bold py-6">
      Error: {error?.message || "Unknown error occurred"}
    </div>
  );

  // No data component
  const NoDataMessage = () => (
    <div className="text-white text-center font-bold py-6">
      No data available
    </div>
  );

  // If no token is available yet, show loading
  if (!token) {
    return (
      <div className="mx-auto p-4">
        <div className="text-white text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          Initializing...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      {/* Combined Leaderboard */}
      <div className="col-span-2">
        <div className="bg-[#8a2be2] rounded-t-lg p-4 flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a2be2] mr-3">
            <Image
              src={vector1 || "/placeholder.svg"}
              width={100}
              height={100}
              alt="logo_image"
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

            <div className="max-h-[500px] overflow-y-auto relative">
              {isCombinedLoading ? (
                <LeaderboardSkeleton />
              ) : isCombinedError ? (
                <ErrorMessage error={combinedError} />
              ) : combinedLeaderboard.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {combinedLeaderboard
                    .filter((entry: any) => !entry.isCurrentUser)
                    .map((entry: any, idx: number) => (
                      <div
                        key={entry.id || idx}
                        className="grid grid-cols-4 items-center text-center py-3 bg-[#FFFFFF1A] rounded-md border"
                      >
                        <div className="font-bold text-white">{idx + 1}</div>
                        <div className="flex items-center text-left">
                          <div>
                            <div className="font-medium text-white">
                              {entry.user?.fullName || "Unknown User"}
                            </div>
                            <div className="text-xs text-white/70">
                              @{entry.user?.screenName || "unknown"}
                            </div>
                          </div>
                        </div>
                        <div className="text-white">
                          {entry.tierRank || "N/A"}
                        </div>
                        <div className="font-bold text-white">
                          {entry.totalPoints || 0}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <NoDataMessage />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* TMC Leaderboard */}
        <div className="rounded-b-lg overflow-hidden">
          <div className="bg-[#B268FA] rounded-t-lg p-4 flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
              <Image
                src={vector2 || "/placeholder.svg"}
                width={100}
                height={100}
                alt="logo_image"
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold text-white">
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

              <div className="max-h-[500px] overflow-y-auto relative">
                {isTmcLoading ? (
                  <LeaderboardSkeleton />
                ) : isTmcError ? (
                  <ErrorMessage error={tmcError} />
                ) : TMCLeaderboard.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {TMCLeaderboard.filter(
                      (entry: any) => !entry.isCurrentUser
                    ).map((entry: any, idx: number) => (
                      <div
                        key={entry.id || idx}
                        className="grid grid-cols-4 items-center text-center py-3 bg-[#FFFFFF1A] rounded-md border"
                      >
                        <div className="font-bold text-white">{idx + 1}</div>
                        <div className="flex items-center text-left">
                          <div>
                            <div className="font-medium text-white">
                              {entry.user?.fullName || "Unknown User"}
                            </div>
                            <div className="text-xs text-white/70">
                              @{entry.user?.screenName || "unknown"}
                            </div>
                          </div>
                        </div>
                        <div className="text-white">
                          {entry.tierRank || "N/A"}
                        </div>
                        <div className="font-bold text-white">
                          {entry.totalTMCPoints || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoDataMessage />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ARV Leaderboard */}
        <div>
          <div className="bg-[#9186FF] rounded-t-lg p-4 flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
              <Image
                src={vector3 || "/placeholder.svg"}
                width={100}
                height={100}
                alt="logo_image"
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold text-white">
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

              <div className="max-h-[500px] overflow-y-auto relative">
                {isArvLoading ? (
                  <LeaderboardSkeleton />
                ) : isArvError ? (
                  <ErrorMessage error={arvError} />
                ) : ARVLeaderboard.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {ARVLeaderboard.filter(
                      (entry: any) => !entry.isCurrentUser
                    ).map((entry: any, idx: number) => (
                      <div
                        key={entry.id || idx}
                        className="grid grid-cols-4 items-center text-center py-3 bg-[#FFFFFF1A] rounded-md border"
                      >
                        <div className="font-bold text-white">{idx + 1}</div>
                        <div className="flex items-center text-left">
                          <div>
                            <div className="font-medium text-white">
                              {entry.user?.fullName || "Unknown User"}
                            </div>
                            <div className="text-xs text-white/70">
                              @{entry.user?.screenName || "unknown"}
                            </div>
                          </div>
                        </div>
                        <div className="text-white">
                          {entry.tierRank || "N/A"}
                        </div>
                        <div className="font-bold text-white">
                          {entry.totalARVPoints || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoDataMessage />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
