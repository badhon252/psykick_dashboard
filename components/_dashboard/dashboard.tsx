/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { StatCard } from "@/components/stat-card";
import { Progress } from "@/components/ui/progress";
import { token } from "@/data/data";
import { useQuery } from "@tanstack/react-query";
import { Clock, Target, Users } from "lucide-react";

import SkeletonWrapper from "../ui/skeleton-wrapper";
import TotalParticippationofTmsc from "./TotalParticippationofTmsc";

interface ApiProps {
  status: boolean;
  message: string;
  data: number;
}



export default function Dashboard() {

// all user 
  const { isLoading: isTotalUserLoading, data: totalUserstats } =
    useQuery<ApiProps>({
      queryKey: ["totalUserstats"],
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/all-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json()),
    });
// avarage time spent 
  const {  } =
    useQuery<ApiProps>({
      queryKey: ["totalTimeSpent"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/average-session-duration`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json()),
    });

    // active user 
  const { isLoading: activeUserLoading, data: activeuserRes } =
    useQuery<ApiProps>({
      queryKey: ["activeUser"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/active-users-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json()),
    });
    
 

    console.log("totalUserstats", totalUserstats);
  console.log("activeuserRes", activeuserRes);
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className=" p-6 space-y-6">
        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-xl text-white mb-2">
            Welcome to the Psykick Club
          </h2>
          <div className="flex items-center gap-2">
            <Progress value={60} className="h-2 w-[270px] bg-white" />
            <div className="text-xs text-white/70 ">Profile complete 60%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonWrapper isLoading={isTotalUserLoading}>
            <StatCard
              title="Total Users"
              value={totalUserstats?.data ?? 0}
              icon={Users}
            />
          </SkeletonWrapper>
          <StatCard title="Average time spent" value="3505" icon={Clock} />
          <SkeletonWrapper isLoading={activeUserLoading}>
            <StatCard
              title="Active users"
              value={activeuserRes?.data ?? 0}
              icon={Users}
            />
          </SkeletonWrapper>
          <StatCard title="Completed Target" value="3505" icon={Target} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
       
       <TotalParticippationofTmsc/>


       

          {/* <Card className="bg-[#170A2C]/50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">
                Highest Playing Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Number of users</span>
                    <span className="text-sm text-white">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">
                      Number of active users
                    </span>
                    <span className="text-sm text-white">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">
                      Number of targets completed
                    </span>
                    <span className="text-sm text-white">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">
                      Average time spent
                    </span>
                    <span className="text-sm text-white">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">
                      Number of affiliate link clicks
                    </span>
                    <span className="text-sm text-white">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Pending messages</span>
                    <span className="text-sm text-white">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </main>
    </div>
  );
}
