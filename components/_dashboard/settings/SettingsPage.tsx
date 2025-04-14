"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/user-avatar"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-[#170A2C] border-b border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
              Account
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardHeader>
                <CardTitle className="text-white">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <UserAvatar name="Aliana" image="/placeholder-user.jpg" className="h-24 w-24" />
                    <Button variant="outline" className="bg-[#170A2C] border-gray-700 text-white">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">First Name</Label>
                        <Input defaultValue="Aliana" className="bg-[#170A2C] border-gray-700 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Last Name</Label>
                        <Input defaultValue="Smith" className="bg-[#170A2C] border-gray-700 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email</Label>
                      <Input
                        type="email"
                        defaultValue="aliana@example.com"
                        className="bg-[#170A2C] border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Bio</Label>
                      <Textarea
                        defaultValue="Admin at Psykick.club"
                        className="bg-[#170A2C] border-gray-700 text-white min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Username</Label>
                    <Input defaultValue="aliana_admin" className="bg-[#170A2C] border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-[#170A2C] border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">New Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-[#170A2C] border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" className="bg-[#170A2C] border-gray-700 text-white" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardHeader>
                <CardTitle className="text-white">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive email notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Target Updates</p>
                      <p className="text-sm text-gray-400">Get notified when targets are updated</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">User Results</p>
                      <p className="text-sm text-gray-400">Get notified about new user results</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">System Alerts</p>
                      <p className="text-sm text-gray-400">Receive system alerts and updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card className="bg-[#170A2C]/50 border-0">
              <CardHeader>
                <CardTitle className="text-white">Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-2 border-[#8F37FF] p-4 rounded-md bg-[#170A2C] cursor-pointer">
                        <p className="text-white text-center">Dark</p>
                      </div>
                      <div className="border-2 border-gray-700 p-4 rounded-md bg-white cursor-pointer">
                        <p className="text-gray-900 text-center">Light</p>
                      </div>
                      <div className="border-2 border-gray-700 p-4 rounded-md bg-gradient-to-r from-[#170A2C] to-white cursor-pointer">
                        <p className="text-center text-white">System</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Font Size</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-2 border-gray-700 p-4 rounded-md cursor-pointer">
                        <p className="text-white text-center text-sm">Small</p>
                      </div>
                      <div className="border-2 border-[#8F37FF] p-4 rounded-md cursor-pointer">
                        <p className="text-white text-center">Medium</p>
                      </div>
                      <div className="border-2 border-gray-700 p-4 rounded-md cursor-pointer">
                        <p className="text-white text-center text-lg">Large</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Animations</p>
                      <p className="text-sm text-gray-400">Enable UI animations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Apply Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
