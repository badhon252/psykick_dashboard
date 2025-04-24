"use client";

import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { token } from "@/data/data";
import { useQuery } from "@tanstack/react-query";
import { Clock, Target, Users } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SkeletonWrapper from "../ui/skeleton-wrapper";

interface ApiProps {
  status: boolean;
  message: string;
  data: number;
}

const chartData = [
  { name: "Jan", tmc: 30, arv: 40 },
  { name: "Feb", tmc: 50, arv: 60 },
  { name: "Mar", tmc: 70, arv: 50 },
  { name: "Apr", tmc: 90, arv: 70 },
  { name: "May", tmc: 120, arv: 90 },
  { name: "Jun", tmc: 150, arv: 120 },
  { name: "Jul", tmc: 180, arv: 170 },
  { name: "Aug", tmc: 160, arv: 190 },
  { name: "Sep", tmc: 140, arv: 170 },
  { name: "Oct", tmc: 120, arv: 130 },
  { name: "Nov", tmc: 100, arv: 110 },
  { name: "Dec", tmc: 80, arv: 90 },
];

export default function Dashboard() {
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
  const {} =
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#170A2C]/50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">
                Total Participation of TMC & ARV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#170A2C",
                        borderColor: "#333",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tmc"
                      name="TMC"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="arv"
                      name="ARV"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#170A2C]/50 border-0">
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
          </Card>
        </div>
      </main>
    </div>
  );
}
