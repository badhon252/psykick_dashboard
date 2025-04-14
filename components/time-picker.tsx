"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  title: string
  onTimeChange?: (date: Date) => void
}

export function TimePicker({ title, onTimeChange }: TimePickerProps) {
  const [month, setMonth] = useState("Jan")
  const [year, setYear] = useState(2025)
  const [selectedDay, setSelectedDay] = useState(6)
  const [selectedHour, setSelectedHour] = useState(12)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM")

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 58, 59]

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]
  const daysInCalendar = [
    [26, 27, 28, 29, 30, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [31, 1, 2, 3, 4, 5, 6],
  ]

  return (
    <div className="flex flex-col">
      <div className="bg-[#8F37FF] text-white p-3 text-center rounded-t-md">{title}</div>
      <div className="flex">
        <div className="border border-gray-700 bg-gray-100 text-gray-800">
          <div className="flex items-center justify-between p-2 border-b border-gray-300">
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <span className="text-sm">{month}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
            <div className="flex gap-2">
              <span className="text-sm">{year}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          <div className="grid grid-cols-7 text-center">
            {weekDays.map((day, i) => (
              <div key={i} className="p-2 text-sm font-medium">
                {day}
              </div>
            ))}
            {daysInCalendar.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={cn(
                    "p-2 text-sm cursor-pointer hover:bg-gray-200",
                    day === selectedDay && "bg-[#8F37FF] text-white",
                  )}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </div>
              )),
            )}
          </div>
        </div>
        <div className="flex border border-gray-700 bg-gray-100 text-gray-800">
          <div className="flex flex-col border-r border-gray-300">
            <div className="p-4 text-center border-b border-gray-300">
              <span className="text-2xl font-bold">01</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={cn(
                    "p-2 text-center cursor-pointer hover:bg-gray-200",
                    hour === selectedHour && "bg-[#8F37FF] text-white",
                  )}
                  onClick={() => setSelectedHour(hour)}
                >
                  {hour.toString().padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col border-r border-gray-300">
            <div className="p-4 text-center border-b border-gray-300">
              <span className="text-2xl font-bold">00</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={cn(
                    "p-2 text-center cursor-pointer hover:bg-gray-200",
                    minute === selectedMinute && "bg-[#8F37FF] text-white",
                  )}
                  onClick={() => setSelectedMinute(minute)}
                >
                  {minute.toString().padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="p-4 text-center border-b border-gray-300">
              <span className="text-2xl font-bold">AM</span>
            </div>
            <div
              className={cn(
                "p-4 text-center cursor-pointer hover:bg-gray-200",
                amPm === "AM" && "bg-[#8F37FF] text-white",
              )}
              onClick={() => setAmPm("AM")}
            >
              AM
            </div>
            <div
              className={cn(
                "p-4 text-center cursor-pointer hover:bg-gray-200",
                amPm === "PM" && "bg-[#8F37FF] text-white",
              )}
              onClick={() => setAmPm("PM")}
            >
              PM
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
