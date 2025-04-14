"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for targets
const tmcActiveTargets = [
  {
    id: "tmc-1",
    code: "ABC-25G",
    revealTime: "20/05/2026",
    timeLeft: { hours: 23, minutes: 34, seconds: 57 },
    active: true,
  },
]

const tmcInactiveTargets = Array.from({ length: 6 }).map((_, i) => ({
  id: `inactive-${i}`,
  code: "ABC-25G",
  status: "Active",
  revealTime: "2 October 2024 10:43:00",
}))

const arvActiveTargets = [
  {
    id: "arv-1",
    code: "ABC-25G",
    eventName: "Bitcoin price on 25/10/2025",
    revealTime: "20/05/2026",
    timeLeft: { hours: 23, minutes: 34, seconds: 57 },
    active: true,
  },
  {
    id: "arv-2",
    code: "ABC-25G",
    eventName: "Bitcoin price on 25/10/2025",
    revealTime: "20/05/2026",
    timeLeft: { hours: 0, minutes: 0, seconds: 0 },
    active: true,
  },
]

const arvInactiveTargets = Array.from({ length: 6 }).map((_, i) => ({
  id: `inactive-${i}`,
  code: "ABC-25G",
  eventName: "Bitcoin price on 25/10/2025",
  status: "Active",
  revealTime: "2 October 2024 10:43:00",
}))

export default function ManageTargetsPage() {
  // const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* TMC Targets Section */}
        <div>
          <div className="bg-[#8F37FF] text-white p-3 rounded-t-md font-medium text-[28px]">TMC Targets</div>

          {/* Active Targets */}
          <div className="rounded-b-md mb-6">
            <div className="bg-[#fffbfb12] my-[30px] p-10 rounded-lg">
              <h2 className="text-white text-[28px] font-semibold mb-4">Active Targets</h2>

              {tmcActiveTargets.map((target) => (
                <div key={target.id} className="rounded-lg p-4 mb-4 bg-white/10 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl p-5 w-[577px]">
                    <div>
                      <p className="text-white">Code: {target.code}</p>
                      <p className="text-white">Reveal Time: {target.revealTime}</p>
                      <Button size="sm" className="rounded-sm bg-red-600 hover:bg-red-700 text-white my-2">
                        Deactive
                      </Button>
                    </div>
                    <div className="p-3 rounded-md text-center bg-white/20">
                      <p className="text-xs text-white mb-1">Hurry up! Time ends in:</p>
                      <div className="flex gap-2 text-white">
                        <div className="p-1 rounded">
                          <span className="text-lg">{String(target.timeLeft.hours).padStart(2, "0")}</span>
                          <span className="text-xs block">Hours</span>
                        </div>
                        <span className="text-lg">:</span>
                        <div className="p-1 rounded">
                          <span className="text-lg">{String(target.timeLeft.minutes).padStart(2, "0")}</span>
                          <span className="text-xs block">Mins</span>
                        </div>
                        <span className="text-lg">:</span>
                        <div className="p-1 rounded">
                          <span className="text-lg">{String(target.timeLeft.seconds).padStart(2, "0")}</span>
                          <span className="text-xs block">Secs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#c4a0ff17] p-6 rounded-lg">
              {/* Inactive Targets */}
              <div>
                <h2 className="text-white text-xl mb-4">Inactive Targets</h2>
                <div className="rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 bg-white text-black p-3">
                    <div>Code</div>
                    <div>Status</div>
                    <div className="flex justify-between">
                      <span>Reveal Time</span>
                      <span>Add to Queue</span>
                    </div>
                  </div>
                </div>
              </div>

              {tmcInactiveTargets.map((target, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 border-t border-[#3A2D4C] p-3 text-white bg-white/10 my-3 rounded-lg"
                >
                  <div>{target.code}</div>
                  <div>
                    <Badge className="bg-green-600 rounded-sm">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{target.revealTime}</span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-sm">
                      Add to
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ARV Targets Section */}
        <div>
          <div className="bg-[#8F37FF] text-white p-3 rounded-t-md font-medium text-[28px]">ARV Targets</div>

          {/* Active Targets */}
          <div className="rounded-b-md mb-6">
            <div className="bg-[#fffbfb12] my-[30px] p-10 rounded-lg">
              <h2 className="text-white text-[28px] font-semibold mb-4">Active Targets</h2>

              {arvActiveTargets.map((target) => (
                <div key={target.id} className="rounded-lg p-4 mb-4 bg-white/10 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl p-5 w-[577px]">
                    <div>
                      <p className="text-white">Event Name: {target.eventName}</p>
                      <p className="text-white">Code: {target.code}</p>
                      <p className="text-white">Reveal Time: {target.revealTime}</p>
                      <Button size="sm" className="rounded-sm bg-red-600 hover:bg-red-700 text-white my-2">
                        Deactive
                      </Button>
                    </div>

                    {target.timeLeft.hours === 0 && target.timeLeft.minutes === 0 && target.timeLeft.seconds === 0 ? (
                      <Link href="/manage-targets/set-outcome">
                        <Button className="bg-[#8F37FF] hover:bg-[#8F37FF]/80 text-white rounded-sm">
                          Set Outcome
                        </Button>
                      </Link>
                    ) : (
                      <div className="p-3 rounded-md text-center bg-white/20">
                        <p className="text-xs text-white mb-1">Hurry up! Time ends in:</p>
                        <div className="flex gap-2 text-white">
                          <div className="p-1 rounded">
                            <span className="text-lg">{String(target.timeLeft.hours).padStart(2, "0")}</span>
                            <span className="text-xs block">Hours</span>
                          </div>
                          <span className="text-lg">:</span>
                          <div className="p-1 rounded">
                            <span className="text-lg">{String(target.timeLeft.minutes).padStart(2, "0")}</span>
                            <span className="text-xs block">Mins</span>
                          </div>
                          <span className="text-lg">:</span>
                          <div className="p-1 rounded">
                            <span className="text-lg">{String(target.timeLeft.seconds).padStart(2, "0")}</span>
                            <span className="text-xs block">Secs</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#c4a0ff17] p-6 rounded-lg">
              {/* Inactive Targets */}
              <div>
                <h2 className="text-white text-xl mb-4">Inactive Targets</h2>
                <div className="rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 bg-white text-black p-3">
                    <div>Event Name</div>
                    <div>Code</div>
                    <div>Status</div>
                    <div className="flex justify-between">
                      <span>Reveal Time</span>
                      <span>Add to Queue</span>
                    </div>
                  </div>
                </div>
              </div>

              {arvInactiveTargets.map((target, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 border-t border-[#3A2D4C] p-3 text-white bg-white/10 my-3 rounded-lg"
                >
                  <div>{target.eventName}</div>
                  <div>{target.code}</div>
                  <div>
                    <Badge className="bg-green-600 rounded-sm">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{target.revealTime}</span>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-sm">
                      Add to
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
