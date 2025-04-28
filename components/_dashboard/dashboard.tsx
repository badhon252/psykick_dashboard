/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { StatCard } from "@/components/stat-card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Clock, Target, Users } from "lucide-react";

import SkeletonWrapper from "../ui/skeleton-wrapper";
import TotalParticippationofTmsc from "./TotalParticippationofTmsc";

// Define API response types
interface ApiProps {
  status: boolean;
  message: string;
  data: number;
}

interface AverageTimeResponse {
  status: boolean;
  message: string;
  data: {
    averageDurationInMinutes: number;
  };
}

export default function Dashboard() {

const token = localStorage.getItem('token'); // get token from localStorage

  // Fetch total users
  const { isLoading: isTotalUserLoading, data: totalUserStats } = useQuery<ApiProps>({
    queryKey: ["totalUserStats"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/all-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  // Fetch average session duration
  const { isLoading: isAverageTimeLoading, data: averageTime } = useQuery<AverageTimeResponse>({
    queryKey: ["averageSessionDuration"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/average-session-duration`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  // Fetch active users count
  const { isLoading: isActiveUserLoading, data: activeUserStats } = useQuery<ApiProps>({
    queryKey: ["activeUserCount"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/active-users-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  // Fetch completed targets count
  const { isLoading: isCompletedTargetLoading, data: completedTargetsStats } = useQuery<ApiProps>({
    queryKey: ["completedTargets"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/completedTargets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-6 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-xl text-white mb-2">Welcome to the Psykick Club</h2>
          <div className="flex items-center gap-2">
            <Progress value={60} className="h-2 w-[270px] bg-white" />
            <div className="text-xs text-white/70">Profile complete 60%</div>
          </div>
        </div>

        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <SkeletonWrapper isLoading={isTotalUserLoading}>
            <StatCard
              title="Total Users"
              value={totalUserStats?.data ?? 0}
              icon={Users}
            />
          </SkeletonWrapper>

          {/* Average Time Spent */}
          <SkeletonWrapper isLoading={isAverageTimeLoading}>
            <StatCard
              title="Average Time Spent"
              value={averageTime?.data?.averageDurationInMinutes ?? 0}
              icon={Clock}
            />
          </SkeletonWrapper>

          {/* Active Users */}
          <SkeletonWrapper isLoading={isActiveUserLoading}>
            <StatCard
              title="Active Users"
              value={activeUserStats?.data ?? 0}
              icon={Users}
            />
          </SkeletonWrapper>

          {/* Completed Targets */}
          <SkeletonWrapper isLoading={isCompletedTargetLoading}>
            <StatCard
              title="Completed Targets"
              value={completedTargetsStats?.data ?? 0}
              icon={Target}
            />
          </SkeletonWrapper>
        </div>

        {/* Participation Chart/Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <TotalParticippationofTmsc />
        </div>

      </main>
    </div>
  );
}
