"use client";

import { useEffect } from "react";
import { useLeaderboardStore } from "@/store/use-leaderboard";

export default function Leaderboard() {
  const {
    tmcLeaderboard,
    arvLeaderboard,
    combinedLeaderboard,
    fetchLeaderboardData,
  } = useLeaderboardStore();

  // Fetch data on initial load
  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Function to get row background color based on rank
  const getRowColor = (rank: string, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-[#2a904c]";

    switch (rank) {
      case "01":
        return "bg-[#ec762c]";
      case "02":
        return "bg-[#5ec9c0]";
      case "03":
        return "bg-[#3a51e9]";
      default:
        return "bg-[#4a2c7e]";
    }
  };

  return (
    <div className=" mx-auto p-4">
      {/* Tab buttons */}
      {/* <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("tmc")}
          className={`px-6 py-3 rounded-lg transition-colors ${
            activeTab === "tmc"
              ? "bg-[#8a2be2] text-white"
              : "border border-white/30 bg-[#3a1c6e] text-white"
          }`}
        >
          Target Match Challenge
        </button>
        <button
          onClick={() => setActiveTab("arv")}
          className={`px-6 py-3 rounded-lg transition-colors ${
            activeTab === "arv"
              ? "bg-[#8a2be2] text-white"
              : "border border-white/30 bg-[#3a1c6e] text-white"
          }`}
        >
          ARV Prediction Mode
        </button>
        <button
          onClick={() => setActiveTab("combined")}
          className={`px-6 py-3 rounded-lg transition-colors ${
            activeTab === "combined"
              ? "bg-[#8a2be2] text-white"
              : "border border-white/30 bg-[#3a1c6e] text-white"
          }`}
        >
          Leaderboards
        </button>
      </div> */}

      {/* Combined Leaderboard */}
      <div className="col-span-2">
        <div className="bg-[#8a2be2] rounded-t-lg p-4 flex items-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8a2be2] mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="m18 9-2-2" />
              <path d="m8 17-2-2" />
              <path d="m13 12-2-2" />
              <path d="m18 14-2-2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">
            Combined Leaderboard
          </h2>
        </div>

        <div className="bg-white rounded-b-lg overflow-hidden">
          <div className="grid grid-cols-4 text-center py-2 border-b border-gray-200">
            <div className="text-gray-600 font-medium">Rank</div>
            <div className="text-gray-600 font-medium text-left pl-4">
              Profile
            </div>
            <div className="text-gray-600 font-medium">RV Tier</div>
            <div className="text-gray-600 font-medium">Score</div>
          </div>

          <div className="max-h-[500px] overflow-y-auto relative">
            {combinedLeaderboard
              .filter((entry) => !entry.isCurrentUser)
              .map((entry) => (
                <div
                  key={entry.id}
                  className={`grid grid-cols-4 items-center text-center py-3 ${getRowColor(
                    entry.rank,
                    entry.isCurrentUser
                  )}`}
                >
                  <div className="font-bold text-white">{entry.rank}</div>
                  <div className="flex items-center text-left">
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold mr-2">
                      {entry.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-white">{entry.name}</div>
                      <div className="text-xs text-white/70">
                        {entry.username}
                      </div>
                    </div>
                  </div>
                  <div className="text-white">{entry.tier}</div>
                  <div className="font-bold text-white">{entry.score}</div>
                </div>
              ))}

            {/* Current user fixed at bottom */}
            {/* {combinedLeaderboard.find((entry) => entry.isCurrentUser) && (
              <div
                className={`grid grid-cols-4 items-center text-center py-3 bg-[#2a904c] sticky bottom-0`}
              >
                <div className="font-bold text-white">
                  {
                    combinedLeaderboard.find((entry) => entry.isCurrentUser)
                      ?.rank
                  }
                </div>
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold mr-2">
                    Y
                  </div>
                  <div>
                    <div className="font-medium text-white">You</div>
                    <div className="text-xs text-white/70">@monon</div>
                  </div>
                </div>
                <div className="text-white">Novice</div>
                <div className="font-bold text-white">
                  {
                    combinedLeaderboard.find((entry) => entry.isCurrentUser)
                      ?.score
                  }
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
      {/* Leaderboard grid */}
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* TMC Leaderboard */}
        <div>
          <div className="bg-[#e0d0ff] rounded-t-lg p-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#8a2be2] flex items-center justify-center text-white mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#3a1c6e]">
              TMC Leaderboard
            </h2>
          </div>

          <div className="bg-white rounded-b-lg overflow-hidden">
            <div className="grid grid-cols-4 text-center py-2 border-b border-gray-200">
              <div className="text-gray-600 font-medium">Rank</div>
              <div className="text-gray-600 font-medium text-left pl-4">
                Profile
              </div>
              <div className="text-gray-600 font-medium">RV Tier</div>
              <div className="text-gray-600 font-medium">Score</div>
            </div>

            <div className="max-h-[500px] overflow-y-auto relative">
              {tmcLeaderboard
                .filter((entry) => !entry.isCurrentUser)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-4 items-center text-center py-3 ${getRowColor(
                      entry.rank,
                      entry.isCurrentUser
                    )}`}
                  >
                    <div className="font-bold text-white">{entry.rank}</div>
                    <div className="flex items-center text-left">
                      <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold mr-2">
                        {entry.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {entry.name}
                        </div>
                        <div className="text-xs text-white/70">
                          {entry.username}
                        </div>
                      </div>
                    </div>
                    <div className="text-white">{entry.tier}</div>
                    <div className="font-bold text-white">{entry.score}</div>
                  </div>
                ))}

              {/* Current user fixed at bottom */}
              {/* <div
                className={`grid grid-cols-4 items-center text-center py-3 bg-[#2a904c] sticky bottom-0`}
              >
                <div className="font-bold text-white">
                  {tmcLeaderboard.find((entry) => entry.isCurrentUser)?.rank}
                </div>
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold mr-2">
                    Y
                  </div>
                  <div>
                    <div className="font-medium text-white">You</div>
                    <div className="text-xs text-white/70">@monon</div>
                  </div>
                </div>
                <div className="text-white">Novice</div>
                <div className="font-bold text-white">
                  {tmcLeaderboard.find((entry) => entry.isCurrentUser)?.score}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* ARV Leaderboard */}
        <div>
          <div className="bg-[#e0d0ff] rounded-t-lg p-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#8a2be2] flex items-center justify-center text-white mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v8" />
                <path d="m16 6-4 4-4-4" />
                <path d="M8 16H6a2 2 0 0 0-2 2" />
                <path d="M16 16h2a2 2 0 0 1 2 2" />
                <path d="M12 22v-8" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#3a1c6e]">
              ARV Leaderboard
            </h2>
          </div>

          <div className="bg-white rounded-b-lg overflow-hidden">
            <div className="grid grid-cols-4 text-center py-2 border-b border-gray-200">
              <div className="text-gray-600 font-medium">Rank</div>
              <div className="text-gray-600 font-medium text-left pl-4">
                Profile
              </div>
              <div className="text-gray-600 font-medium">RV Tier</div>
              <div className="text-gray-600 font-medium">Score</div>
            </div>

            <div className="max-h-[500px] overflow-y-auto relative">
              {arvLeaderboard
                .filter((entry) => !entry.isCurrentUser)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className={`grid grid-cols-4 items-center text-center py-3 ${getRowColor(
                      entry.rank,
                      entry.isCurrentUser
                    )}`}
                  >
                    <div className="font-bold text-white">{entry.rank}</div>
                    <div className="flex items-center text-left">
                      <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold mr-2">
                        {entry.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {entry.name}
                        </div>
                        <div className="text-xs text-white/70">
                          {entry.username}
                        </div>
                      </div>
                    </div>
                    <div className="text-white">{entry.tier}</div>
                    <div className="font-bold text-white">{entry.score}</div>
                  </div>
                ))}

              {/* Current user fixed at bottom */}
              {/* {arvLeaderboard.find((entry) => entry.isCurrentUser) && (
                <div
                  className={`grid grid-cols-4 items-center text-center py-3 bg-[#2a904c] sticky bottom-0`}
                >
                  <div className="font-bold text-white">
                    {arvLeaderboard.find((entry) => entry.isCurrentUser)?.rank}
                  </div>
                  <div className="flex items-center text-left">
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold mr-2">
                      Y
                    </div>
                    <div>
                      <div className="font-medium text-white">You</div>
                      <div className="text-xs text-white/70">@monon</div>
                    </div>
                  </div>
                  <div className="text-white">Novice</div>
                  <div className="font-bold text-white">
                    {arvLeaderboard.find((entry) => entry.isCurrentUser)?.score}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Refresh button */}
      {/* <div className="flex justify-center ">
        <button
          onClick={fetchLeaderboardData}
          className="flex items-center px-4 py-2 bg-[#8a2be2] text-white rounded-lg hover:bg-[#7a1bd2] transition-colors"
          disabled={isLoading}
        >
          <RefreshCw
            size={18}
            className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh Leaderboards
        </button>
      </div> */}
    </div>
  );
}
