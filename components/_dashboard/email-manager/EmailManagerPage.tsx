"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Search, Filter, Plus } from "lucide-react"

export default function EmailManagerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Email Manager" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-[#170A2C]/50 border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Email Templates</CardTitle>
            <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search templates..." className="pl-8 bg-[#170A2C] border-gray-700 text-white" />
              </div>
              <Button variant="outline" className="bg-[#170A2C] border-gray-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <Table>
              <TableHeader className="bg-[#170A2C]/70">
                <TableRow>
                  <TableHead className="text-white">Template Name</TableHead>
                  <TableHead className="text-white">Subject</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Last Modified</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-700">
                    <TableCell className="text-white">Welcome Email</TableCell>
                    <TableCell className="text-white">Welcome to Psykick.club</TableCell>
                    <TableCell>
                      <Badge className="bg-green-600">Active</Badge>
                    </TableCell>
                    <TableCell className="text-white">2 days ago</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-white">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-[#170A2C]/50 border-0">
          <CardHeader>
            <CardTitle className="text-white">Send Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-white">Recipients</label>
              <Select>
                <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Template</label>
              <Select>
                <SelectTrigger className="bg-[#170A2C] border-gray-700 text-white">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="newsletter">Monthly Newsletter</SelectItem>
                  <SelectItem value="reminder">Event Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Subject</label>
              <Input placeholder="Email subject" className="bg-[#170A2C] border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Message</label>
              <Textarea
                placeholder="Write your message here..."
                className="bg-[#170A2C] border-gray-700 text-white min-h-[200px]"
              />
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
