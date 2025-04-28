"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TmcInactiveTargets from "./_components/TmcInactiveTargets";
import ArvInactiveTargets from "./_components/ArvInactiveTargets";

// Mock data for targets
const tmcActiveTargets = [
  {
    id: "tmc-1",
    code: "ABC-25G",
    revealTime: "20/05/2026",
    timeLeft: { hours: 23, minutes: 34, seconds: 57 },
    active: true,
  },
];

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
];

export default function ManageTargetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* TMC Targets Section */}
        <div>
          <div className="bg-[#8F37FF] text-white p-3 rounded-t-md font-medium text-[28px]">
            TMC Targets
          </div>

          {/* Active Targets */}
          <div className="rounded-b-md mb-6">
            <div className="bg-[#fffbfb12] my-[30px] p-10 rounded-lg">
              <h2 className="text-white text-[28px] font-semibold mb-4">
                Active Targets
              </h2>

              {tmcActiveTargets.map((target) => (
                <div
                  key={target.id}
                  className="rounded-lg p-4 mb-4 bg-white/10 w-full"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl p-5 w-[577px]">
                    <div>
                      <p className="text-white">Code: {target.code}</p>
                      <p className="text-white">
                        Reveal Time: {target.revealTime}
                      </p>
                      <Button
                        size="sm"
                        className="rounded-sm bg-red-600 hover:bg-red-700 text-white my-2"
                      >
                        Deactive
                      </Button>
                    </div>
                    <div className="p-3 rounded-md text-center bg-white/20">
                      <p className="text-xs text-white mb-1">
                        Hurry up! Time ends in:
                      </p>
                      <div className="flex gap-2 text-white">
                        <div className="p-1 rounded">
                          <span className="text-lg">
                            {String(target.timeLeft.hours).padStart(2, "0")}
                          </span>
                          <span className="text-xs block">Hours</span>
                        </div>
                        <span className="text-lg">:</span>
                        <div className="p-1 rounded">
                          <span className="text-lg">
                            {String(target.timeLeft.minutes).padStart(2, "0")}
                          </span>
                          <span className="text-xs block">Mins</span>
                        </div>
                        <span className="text-lg">:</span>
                        <div className="p-1 rounded">
                          <span className="text-lg">
                            {String(target.timeLeft.seconds).padStart(2, "0")}
                          </span>
                          <span className="text-xs block">Secs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TMC Targets  */}
            <TmcInactiveTargets />
          </div>
        </div>

        {/* ARV Targets Section */}
        <div>
          <div className="bg-[#8F37FF] text-white p-3 rounded-t-md font-medium text-[28px]">
            ARV Targets
          </div>

          {/* Active Targets */}
          <div className="rounded-b-md mb-6">
            <div className="bg-[#fffbfb12] my-[30px] p-10 rounded-lg">
              <h2 className="text-white text-[28px] font-semibold mb-4">
                Active Targets
              </h2>

              {arvActiveTargets.map((target) => (
                <div
                  key={target.id}
                  className="rounded-lg p-4 mb-4 bg-white/10 w-full"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-xl p-5 w-[577px]">
                    <div>
                      <p className="text-white">
                        Event Name: {target.eventName}
                      </p>
                      <p className="text-white">Code: {target.code}</p>
                      <p className="text-white">
                        Reveal Time: {target.revealTime}
                      </p>
                      <Button
                        size="sm"
                        className="rounded-sm bg-red-600 hover:bg-red-700 text-white my-2"
                      >
                        Deactive
                      </Button>
                    </div>

                    {target.timeLeft.hours === 0 &&
                    target.timeLeft.minutes === 0 &&
                    target.timeLeft.seconds === 0 ? (
                      <Link href="/manage-targets/set-outcome">
                        <Button className="bg-[#8F37FF] hover:bg-[#8F37FF]/80 text-white rounded-sm">
                          Set Outcome
                        </Button>
                      </Link>
                    ) : (
                      <div className="p-3 rounded-md text-center bg-white/20">
                        <p className="text-xs text-white mb-1">
                          Hurry up! Time ends in:
                        </p>
                        <div className="flex gap-2 text-white">
                          <div className="p-1 rounded">
                            <span className="text-lg">
                              {String(target.timeLeft.hours).padStart(2, "0")}
                            </span>
                            <span className="text-xs block">Hours</span>
                          </div>
                          <span className="text-lg">:</span>
                          <div className="p-1 rounded">
                            <span className="text-lg">
                              {String(target.timeLeft.minutes).padStart(2, "0")}
                            </span>
                            <span className="text-xs block">Mins</span>
                          </div>
                          <span className="text-lg">:</span>
                          <div className="p-1 rounded">
                            <span className="text-lg">
                              {String(target.timeLeft.seconds).padStart(2, "0")}
                            </span>
                            <span className="text-xs block">Secs</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* arv inactive targets  */}
            <ArvInactiveTargets />
          </div>
        </div>
      </main>
    </div>
  );
}
