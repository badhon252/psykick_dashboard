/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UserAvatar } from "@/components/user-avatar"
// import { Label } from "@/components/ui/label"

// export default function SettingsPage() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <main className="flex-1 p-6 space-y-6">
//         <Tabs defaultValue="profile" className="w-full">
//           <TabsList className="bg-[#170A2C] border-b border-gray-700">
//             <TabsTrigger value="profile" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
//               Profile
//             </TabsTrigger>
//             <TabsTrigger value="account" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
//               Account
//             </TabsTrigger>
//             <TabsTrigger
//               value="notifications"
//               className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white"
//             >
//               Notifications
//             </TabsTrigger>
//             <TabsTrigger value="appearance" className="data-[state=active]:bg-[#8F37FF] data-[state=active]:text-white">
//               Appearance
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="profile" className="mt-6">
//             <Card className="bg-[#170A2C]/50 border-0">
//               <CardHeader>
//                 <CardTitle className="text-white">Profile Settings</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="flex flex-col md:flex-row gap-6">
//                   <div className="flex flex-col items-center gap-4">
//                     <UserAvatar name="Aliana" image="/placeholder-user.jpg" className="h-24 w-24" />
//                     <Button variant="outline" className="bg-[#170A2C] border-gray-700 text-white">
//                       Change Avatar
//                     </Button>
//                   </div>
//                   <div className="flex-1 space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label className="text-white">First Name</Label>
//                         <Input defaultValue="Aliana" className="bg-[#170A2C] border-gray-700 text-white" />
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-white">Last Name</Label>
//                         <Input defaultValue="Smith" className="bg-[#170A2C] border-gray-700 text-white" />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-white">Email</Label>
//                       <Input
//                         type="email"
//                         defaultValue="aliana@example.com"
//                         className="bg-[#170A2C] border-gray-700 text-white"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-white">Bio</Label>
//                       <Textarea
//                         defaultValue="Admin at Psykick.club"
//                         className="bg-[#170A2C] border-gray-700 text-white min-h-[100px]"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex justify-end">
//                   <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Save Changes</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="account" className="mt-6">
//             <Card className="bg-[#170A2C]/50 border-0">
//               <CardHeader>
//                 <CardTitle className="text-white">Account Settings</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-white">Username</Label>
//                     <Input defaultValue="aliana_admin" className="bg-[#170A2C] border-gray-700 text-white" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-white">Current Password</Label>
//                     <Input type="password" placeholder="••••••••" className="bg-[#170A2C] border-gray-700 text-white" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-white">New Password</Label>
//                     <Input type="password" placeholder="••••••••" className="bg-[#170A2C] border-gray-700 text-white" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-white">Confirm New Password</Label>
//                     <Input type="password" placeholder="••••••••" className="bg-[#170A2C] border-gray-700 text-white" />
//                   </div>
//                 </div>
//                 <div className="flex justify-end">
//                   <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Update Password</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="notifications" className="mt-6">
//             <Card className="bg-[#170A2C]/50 border-0">
//               <CardHeader>
//                 <CardTitle className="text-white">Notification Settings</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-white">Email Notifications</p>
//                       <p className="text-sm text-gray-400">Receive email notifications</p>
//                     </div>
//                     <Switch defaultChecked />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-white">Target Updates</p>
//                       <p className="text-sm text-gray-400">Get notified when targets are updated</p>
//                     </div>
//                     <Switch defaultChecked />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-white">User Results</p>
//                       <p className="text-sm text-gray-400">Get notified about new user results</p>
//                     </div>
//                     <Switch />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-white">System Alerts</p>
//                       <p className="text-sm text-gray-400">Receive system alerts and updates</p>
//                     </div>
//                     <Switch defaultChecked />
//                   </div>
//                 </div>
//                 <div className="flex justify-end mt-6">
//                   <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Save Preferences</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="appearance" className="mt-6">
//             <Card className="bg-[#170A2C]/50 border-0">
//               <CardHeader>
//                 <CardTitle className="text-white">Appearance Settings</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-white">Theme</Label>
//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="border-2 border-[#8F37FF] p-4 rounded-md bg-[#170A2C] cursor-pointer">
//                         <p className="text-white text-center">Dark</p>
//                       </div>
//                       <div className="border-2 border-gray-700 p-4 rounded-md bg-white cursor-pointer">
//                         <p className="text-gray-900 text-center">Light</p>
//                       </div>
//                       <div className="border-2 border-gray-700 p-4 rounded-md bg-gradient-to-r from-[#170A2C] to-white cursor-pointer">
//                         <p className="text-center text-white">System</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-white">Font Size</Label>
//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="border-2 border-gray-700 p-4 rounded-md cursor-pointer">
//                         <p className="text-white text-center text-sm">Small</p>
//                       </div>
//                       <div className="border-2 border-[#8F37FF] p-4 rounded-md cursor-pointer">
//                         <p className="text-white text-center">Medium</p>
//                       </div>
//                       <div className="border-2 border-gray-700 p-4 rounded-md cursor-pointer">
//                         <p className="text-white text-center text-lg">Large</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-white">Animations</p>
//                       <p className="text-sm text-gray-400">Enable UI animations</p>
//                     </div>
//                     <Switch defaultChecked />
//                   </div>
//                 </div>
//                 <div className="flex justify-end mt-6">
//                   <Button className="bg-[#8F37FF] text-white hover:bg-[#8F37FF]/80">Apply Changes</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   )
// }




"use client"
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function GamingSettings() {
  const [activeSection, setActiveSection] = useState('settings');
  
  const renderContent = () => {
    switch(activeSection) {
      case 'personal':
        return <PersonalInformation />;
      case 'password':
        return <ChangePassword />;
      case 'terms':
        return <TermsConditions />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'about':
        return <AboutUs />;
      default:
        return <SettingsMenu setActiveSection={setActiveSection} />;
    }
  };
  
  return (
    <div className="w-full min-h-screen bg-purple-900 p-4 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg shadow-lg overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}

// Settings Menu Component
function SettingsMenu({ setActiveSection }: any) {
  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold text-white mb-6 px-2">Settings</h1>
      
      <div className="space-y-4">
        <MenuButton 
          label="Personal Information" 
          onClick={() => setActiveSection('personal')} 
        />
        <MenuButton 
          label="Change Password" 
          onClick={() => setActiveSection('password')} 
        />
        <MenuButton 
          label="Terms & conditions" 
          onClick={() => setActiveSection('terms')} 
        />
        <MenuButton 
          label="Privacy Policy" 
          onClick={() => setActiveSection('privacy')} 
        />
        <MenuButton 
          label="About Us" 
          onClick={() => setActiveSection('about')} 
        />
      </div>
    </div>
  );
}

// Menu Button Component
function MenuButton({ label, onClick }: any) {
  return (
    <button 
      className="w-full p-4 bg-purple-700 bg-opacity-50 rounded-lg text-white text-left flex justify-between items-center hover:bg-purple-600 transition-colors"
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronRight className="h-5 w-5" />
    </button>
  );
}

// Personal Information Component
function PersonalInformation() {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Personal Information</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">Edit</button>
      </div>
      
      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-white mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="Jhon Doe"
              />
            </div>
            
            <div>
              <label className="block text-white mb-1">Username</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="Jhon.Doe995@gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-white mb-1">Email address</label>
              <input 
                type="email" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="georgia.young@example.com"
              />
            </div>
            
            <div>
              <label className="block text-white mb-1">Phone Number</label>
              <input 
                type="tel" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="+33175556533"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-white mb-1">Country</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                  defaultValue="USA"
                />
              </div>
              <div className="flex-1">
                <label className="block text-white mb-1">Town/City</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                  defaultValue="Arizona"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white mb-1">Street Address</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="4517 Washington Ave. Manchester, Kentucky 39495"
              />
            </div>
            
            <div>
              <label className="block text-white mb-1">About</label>
              <textarea 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                placeholder="Write here description."
              
              ></textarea>
            </div>
            
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md">
              Save Changes
            </button>
          </div>
          
          <div className="md:w-1/4 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden mb-4">
              <Image width={300} height={300} src="/api/placeholder/128/128" alt="Profile" />
            </div>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md w-full">
              Choose Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Change Password Component
function ChangePassword() {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Change Password</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">Edit</button>
      </div>
      
      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-1">Current Password</label>
            <input 
              type="password" 
              className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
              placeholder="Enter your new password"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                placeholder="Enter your new password"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white mb-1">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                placeholder="Enter your confirm new password"
              />
            </div>
          </div>
          
          <div>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Terms & Conditions Component
function TermsConditions() {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Terms & conditions</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">Edit</button>
      </div>
      
      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <div className="text-white space-y-4 max-h-96 overflow-y-auto">
          <p className="text-gray-300">Effective Date: [Insert Date]</p>
          <p>Welcome to [Your Game Website Name]. Please read these Terms and Conditions  carefully before using the Site or any of its services. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use the Site.</p>
          
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>By using the Site, you agree to comply with and be bound by these Terms and any additional terms or policies that may apply to specific sections or features of the Site.</p>
          
          <h2 className="text-xl font-semibold">2. Use of the Site</h2>
          <p>You agree to use the Site in a manner that is lawful and in compliance with these Terms. You must not:</p>
          <ul className="list-disc pl-8">
            <li>Violate any local, state, or international laws or regulations.</li>
            <li>Engage in fraudulent activities or misuse the Site for any unlawful purposes.</li>
            <li>Upload or distribute harmful content, such as viruses, malware, or any other malicious software.</li>
            <li>Attempt to hack, decompile, reverse-engineer, or otherwise interfere with the functionality or security.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <p>Some features of the Site may require the creation of an account. You agree to:</p>
          <ul className="list-disc pl-8">
            <li>Provide accurate, current, and complete information when registering.</li>
            <li>Maintain the confidentiality of your account and password, and notify us immediately of any unauthorized use of your account.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
          <p>All content provided on the Site, including but not limited to game images, logos, text, videos, and software, is owned by [Your Game Website Name] or its licensors. You are granted a non-exclusive, non-transferable license to use the content for personal, non-commercial purposes. You may not copy, modify, or distribute the content without our express permission.</p>
          
          <h2 className="text-xl font-semibold">5. In-Game Purchases</h2>
          <p>Some games on the Site may offer in-game purchases or premium content. If you make a purchase, you agree to comply with the payment terms and conditions outlined at the point of sale. All purchases are final, and we do not provide refunds unless required by law.</p>
          
          <h2 className="text-xl font-semibold">6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-8">
            <li>Use cheats, bots, or other unauthorized third-party software that interfere with the game experience.</li>
            <li>Harass, threaten, or engage in disruptive behavior with other players.</li>
            <li>Exploit any bugs or glitches in the games to gain an unfair advantage.</li>
            <li>Post offensive, inappropriate, or abusive content on the Site or within game environments.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">7. Privacy Policy</h2>
          <p>Your use of the Site is also governed by our Privacy Policy, which can be found [here]. By using the Site, you consent to our collection, use, and disclosure of your personal data in accordance with the Privacy Policy.</p>
          
          <h2 className="text-xl font-semibold">8. Disclaimers</h2>
          <p>The Site and all games, services, and content are providedwithout warranties of any kind, either express or implied. We do not guarantee that the Site or any game will be error-free, uninterrupted, or secure.</p>
          
          <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, [Your Game Website Name], its affiliates, partners, and employees are not liable for any damages arising from your use or inability to use the Site, including but not limited to any direct, indirect, incidental, or consequential damages.</p>
          
          <h2 className="text-xl font-semibold">10. Modifications to the Terms</h2>
          <p>We reserve the right to modify or update these Terms at any time. Any changes will be posted on this page with an updated Your continued use of the Site after any changes constitutes your acceptance of the new Terms.</p>
          
          <h2 className="text-xl font-semibold">11. Governing Law</h2>
          <p>These Terms are governed by the laws of [Your Country/State], and any disputes arising from these Terms will be resolved in the appropriate courts in [Location].</p>
        </div>
        
        <div className="mt-6">
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Privacy Policy Component
function PrivacyPolicy() {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">Edit</button>
      </div>
      
      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <div className="text-white space-y-4 max-h-96 overflow-y-auto">
          <p className="text-gray-300">Effective Date: [Insert Date]</p>
          <p>Welcome to [Your Game Website Name]. Please read these Terms and Conditions carefully before using the Site or any of its services. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use the Site.</p>
          
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>By using the Site, you agree to comply with and be bound by these Terms and any additional terms or policies that may apply to specific sections or features of the Site.</p>
          
          <h2 className="text-xl font-semibold">2. Use of the Site</h2>
          <p>You agree to use the Site in a manner that is lawful and in compliance with these Terms. You must not:</p>
          <ul className="list-disc pl-8">
            <li>Violate any local, state, or international laws or regulations.</li>
            <li>Engage in fraudulent activities or misuse the Site for any unlawful purposes.</li>
            <li>Upload or distribute harmful content, such as viruses, malware, or any other malicious software.</li>
            <li>Attempt to hack, decompile, reverse-engineer, or otherwise interfere with the  functionality or security.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <p>Some features of the Site may require the creation of an account. You agree to:</p>
          <ul className="list-disc pl-8">
            <li>Provide accurate, current, and complete information when registering.</li>
            <li>Maintain the confidentiality of your account and password, and notify us immediately of any unauthorized use of your account.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
          <p>All content provided on the Site, including but not limited to game images, logos, text, videos, and software, is owned by [Your Game Website Name] or its licensors. You are granted a non-exclusive, non-transferable license to use the content for personal, non-commercial purposes. You may not copy, modify, or distribute the content without our express permission.</p>
          
          <h2 className="text-xl font-semibold">5. In-Game Purchases</h2>
          <p>Some games on the Site may offer in-game purchases or premium content. If you make a purchase, you agree to comply with the payment terms and conditions outlined at the point of sale. All purchases are final, and we do not provide refunds unless required by law.</p>
          
          <h2 className="text-xl font-semibold">6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-8">
            <li>Use cheats, bots, or other unauthorized third-party software that interfere with the game experience.</li>
            <li>Harass, threaten, or engage in disruptive behavior with other players.</li>
            <li>Exploit any bugs or glitches in the games to gain an unfair advantage.</li>
            <li>Post offensive, inappropriate, or abusive content on the Site or within game environments.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">7. Privacy Policy</h2>
          <p>Your use of the Site is also governed by our Privacy Policy, which can be found [here]. By using the Site, you consent to our collection, use, and disclosure of your personal data in accordance with the Privacy Policy.</p>
          
          <h2 className="text-xl font-semibold">8. Disclaimers</h2>
          <p>The Site and all games, services, and content are provided  without warranties of any kind, either express or implied. We do not guarantee that the Site or any game will be error-free, uninterrupted, or secure.</p>
          
          <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, [Your Game Website Name], its affiliates, partners, and employees are not liable for any damages arising from your use or inability to use the Site, including but not limited to any direct, indirect, incidental, or consequential damages.</p>
          
          <h2 className="text-xl font-semibold">10. Modifications to the Terms</h2>
          <p>We reserve the right to modify or update these Terms at any time. Any changes will be posted on this page with an updatedYour continued use of the Site after any changes constitutes your acceptance of the new Terms.</p>
          
          <h2 className="text-xl font-semibold">11. Governing Law</h2>
          <p>These Terms are governed by the laws of [Your Country/State], and any disputes arising from these Terms will be resolved in the appropriate courts in [Location].</p>
        </div>
        
        <div className="mt-6">
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// About Us Component
function AboutUs() {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">About Us</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">Edit</button>
      </div>
      
      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <div className="text-white space-y-6 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold">About Us</h2>
          <p>Welcome to [Your Website Name]!</p>
          <p>At [Your Website Name], passionate about delivering the best gaming experience for all a casual gamer looking for a fun escape or a competitive player aiming for the topgot something for everyone. Our mission is to create a community where players can connect, compete, and have a great time.</p>
          
          <h2 className="text-xl font-semibold">Who We Are</h2>
          <p>We are a team of avid gamers, developers, and designers who are dedicated to providing high-quality games and an engaging platform. Our team has a diverse background in gaming and technology, and we work tirelessly to bring you the latest features, updates, and innovations. Our goal is simple: to make gaming more enjoyable and accessible to everyone.</p>
          <p>From action-packed adventures to strategy-driven challenges, our website offers a wide variety of games to keep you entertained. We are committed to regularly updating our content, introducing new features, and ensuring our platform remains safe, fun, and exciting.</p>
          
          <h2 className="text-xl font-semibold">Why Choose Us?</h2>
          <ul className="list-disc pl-8">
            <li>Quality Games: We carefully select and develop games that provide a great experience for all types of players.</li>
            <li>Community Focused: We believe that gaming is better when shared, so we focus on building a supportive community where players can connect.</li>
            <li>Innovative Features: We continuously strive to enhance your gaming experience through modern updates, and interactive elements.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">Our Commitment to You</h2>
          <p>here to ensure that you have a smooth, fun, and engaging experience every time you visit our site. Your feedback and suggestions are important to us, and  constantly looking for ways to improve.</p>
          <p>Thank you for visiting [Your Website Name].re excited to have you with us, and we hope you enjoy your gaming experience!</p>
          
          <h2 className="text-xl font-semibold">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-1">Facebook</label>
              <input 
                type="url" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="https://www.facebook.com/"
              />
            </div>
            
            <div>
              <label className="block text-white mb-1">Twitter</label>
              <input 
                type="url" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="https://www.twitter.com/"
              />
            </div>
            
            <div>
              <label className="block text-white mb-1">Instagram</label>
              <input 
                type="url" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="https://www.instagram.com/"
              />
            </div>
            
            <div>
              <label className="block text-white mb-1">LinkedIn</label>
              <input 
                type="url" 
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white" 
                defaultValue="https://www.linkedin.com/"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
