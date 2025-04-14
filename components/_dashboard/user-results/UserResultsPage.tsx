"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserAvatar } from "@/components/user-avatar"
import { Users, Target, Rocket } from "lucide-react"

// Mock data for user results
const userResults = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  name: "Fivos papa",
  username: "@mohon",
  tier: "Novice",
  score: i === 0 ? 100 : i === 1 ? 75 : i === 2 ? 45 : i === 3 ? -10 : -55,
  avatar: "/placeholder-user.jpg",
}))

export default function UserResultsPage() {
  const [activeTab, setActiveTab] = useState("combined")

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="User Results" />
      <main className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="combined" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full bg-[#170A2C] border-b border-gray-700">
            <TabsTrigger
              value="combined"
              className="flex-1 data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Combined Leaderboard
            </TabsTrigger>
            <TabsTrigger value="tmc" className="flex-1 data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
              <Target className="mr-2 h-4 w-4" />
              TMC Leaderboard
            </TabsTrigger>
            <TabsTrigger value="arv" className="flex-1 data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
              <Rocket className="mr-2 h-4 w-4" />
              ARV Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combined" className="mt-6">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-[#170A2C]/70">
                    <TableRow>
                      <TableHead className="text-white w-20 text-center">Rank</TableHead>
                      <TableHead className="text-white">Profile</TableHead>
                      <TableHead className="text-white">RV Tier</TableHead>
                      <TableHead className="text-white text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userResults.map((user) => (
                      <TableRow key={user.id} className="border-b border-gray-700">
                        <TableCell className="text-white text-center">{user.id.toString().padStart(2, "0")}</TableCell>
                        <TableCell>
                          <UserAvatar name={user.name} image={user.avatar} role={user.username} />
                        </TableCell>
                        <TableCell className="text-white">{user.tier}</TableCell>
                        <TableCell className="text-white text-right">{user.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tmc" className="mt-6">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-[#170A2C]/70">
                    <TableRow>
                      <TableHead className="text-white w-20 text-center">Rank</TableHead>
                      <TableHead className="text-white">Profile</TableHead>
                      <TableHead className="text-white">RV Tier</TableHead>
                      <TableHead className="text-white text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userResults.map((user) => (
                      <TableRow key={user.id} className="border-b border-gray-700">
                        <TableCell className="text-white text-center">{user.id.toString().padStart(2, "0")}</TableCell>
                        <TableCell>
                          <UserAvatar name={user.name} image={user.avatar} role={user.username} />
                        </TableCell>
                        <TableCell className="text-white">{user.tier}</TableCell>
                        <TableCell className="text-white text-right">{user.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="arv" className="mt-6">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-[#170A2C]/70">
                    <TableRow>
                      <TableHead className="text-white w-20 text-center">Rank</TableHead>
                      <TableHead className="text-white">Profile</TableHead>
                      <TableHead className="text-white">RV Tier</TableHead>
                      <TableHead className="text-white text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userResults.map((user) => (
                      <TableRow key={user.id} className="border-b border-gray-700">
                        <TableCell className="text-white text-center">{user.id.toString().padStart(2, "0")}</TableCell>
                        <TableCell>
                          <UserAvatar name={user.name} image={user.avatar} role={user.username} />
                        </TableCell>
                        <TableCell className="text-white">{user.tier}</TableCell>
                        <TableCell className="text-white text-right">{user.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
