import { create } from "zustand";

type LeaderboardEntry = {
  id: number;
  rank: string;
  name: string;
  username: string;
  tier: string;
  score: number;
  isCurrentUser: boolean;
};

type LeaderboardState = {
  tmcLeaderboard: LeaderboardEntry[];
  arvLeaderboard: LeaderboardEntry[];
  combinedLeaderboard: LeaderboardEntry[];
  activeTab: "tmc" | "arv" | "combined";
  setActiveTab: (tab: "tmc" | "arv" | "combined") => void;
  fetchLeaderboardData: () => Promise<void>;
  isLoading: boolean;
};

// Function to generate random scores for demonstration
const generateRandomScores = () => {
  const scores = [100, 75, 45, -10, -55, -55, -55, -55, -55];
  return scores;
};

// Function to create leaderboard entries
const createLeaderboardEntries = (
  currentUserRank: string
): LeaderboardEntry[] => {
  const scores = generateRandomScores();

  return [
    {
      id: 1,
      rank: "01",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[0],
      isCurrentUser: false,
    },
    {
      id: 2,
      rank: "02",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[1],
      isCurrentUser: false,
    },
    {
      id: 3,
      rank: "03",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[2],
      isCurrentUser: false,
    },
    {
      id: 4,
      rank: "04",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[3],
      isCurrentUser: false,
    },
    {
      id: 5,
      rank: "05",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[4],
      isCurrentUser: false,
    },
    {
      id: 6,
      rank: "06",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[5],
      isCurrentUser: false,
    },
    {
      id: 7,
      rank: "07",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[6],
      isCurrentUser: false,
    },
    {
      id: 8,
      rank: "08",
      name: "Fivos papa",
      username: "@monon",
      tier: "Novice",
      score: scores[7],
      isCurrentUser: false,
    },
    {
      id: 9,
      rank: currentUserRank,
      name: "You",
      username: "@monon",
      tier: "Novice",
      score: scores[8],
      isCurrentUser: true,
    },
  ];
};

export const useLeaderboardStore = create<LeaderboardState>()((set) => ({
  tmcLeaderboard: createLeaderboardEntries("50"),
  arvLeaderboard: createLeaderboardEntries("12"),
  combinedLeaderboard: createLeaderboardEntries("12"),
  activeTab: "tmc",
  isLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchLeaderboardData: async () => {
    set({ isLoading: true });

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate new random data
    const tmcLeaderboard = createLeaderboardEntries("50");
    const arvLeaderboard = createLeaderboardEntries("12");
    const combinedLeaderboard = createLeaderboardEntries("12");

    set({
      tmcLeaderboard,
      arvLeaderboard,
      combinedLeaderboard,
      isLoading: false,
    });
  },
}));
