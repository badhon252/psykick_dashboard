"use client"

import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, Target, LinkIcon, MessageSquare } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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
]

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className=" p-6 space-y-6">
        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-xl text-white mb-2">Welcome to the Psykick Club</h2>
          <div className="flex items-center gap-2">
            <Progress value={60} className="h-2 w-[270px] bg-white" />
            <div className="text-xs text-white/70 ">Profile complete 60%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value="3505" icon={Users} />
          <StatCard title="Average time spent" value="3505" icon={Clock} />
          <StatCard title="Active users" value="3505" icon={Users} />
          <StatCard title="Completed Target" value="3505" icon={Target} />
          <StatCard title="Affiliate Link Clicks" value="3505" icon={LinkIcon} />
          <StatCard title="Pending Messages" value="3505" icon={MessageSquare} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#170A2C]/50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Total Participation of TMC & ARV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#170A2C", borderColor: "#333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="tmc" name="TMC" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="arv" name="ARV" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#170A2C]/50 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Highest Playing Report</CardTitle>
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
                    <span className="text-sm text-white">Number of active users</span>
                    <span className="text-sm text-white">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Number of targets completed</span>
                    <span className="text-sm text-white">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Average time spent</span>
                    <span className="text-sm text-white">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Number of affiliate link clicks</span>
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
  )
}
