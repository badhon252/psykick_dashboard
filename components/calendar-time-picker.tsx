"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarTimePickerProps {
  title: string;
  // onTimeChange?: (date: Date) => void
}

export function CalendarTimePicker({ title }: CalendarTimePickerProps) {
  const [month, setMonth] = useState("Jan");
  const [year, setYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState(6);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // const years = [2023, 2024, 2025, 2026, 2027, 2028]
  const hours = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const minutes = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "58",
    "59",
  ];
  const seconds = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "58",
    "59",
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const daysInCalendar = [
    [26, 27, 28, 29, 30, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [31, 1, 2, 3, 4, 5, 6],
  ];

  const handlePrevMonth = () => {
    const currentIndex = months.indexOf(month);
    if (currentIndex > 0) {
      setMonth(months[currentIndex - 1]);
    } else {
      setMonth(months[months.length - 1]);
      setYear(year - 1);
    }
  };

  // const handleNextMonth = () => {
  //   const currentIndex = months.indexOf(month)
  //   if (currentIndex < months.length - 1) {
  //     setMonth(months[currentIndex + 1])
  //   } else {
  //     setMonth(months[0])
  //     setYear(year + 1)
  //   }
  // }

  return (
    <div className="flex flex-col">
      <div className="bg-[#8F37FF] text-white p-3 text-center rounded-t-md">
        {title}
      </div>
      <div className="flex">
        <div className="border border-gray-700 bg-gray-100 text-gray-800">
          <div className="flex items-center justify-between p-2 border-b border-gray-300">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2 items-center">
              <span className="text-sm">{month}</span>
              <ChevronRight className="h-4 w-4 invisible" />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">{year}</span>
              <ChevronRight className="h-4 w-4 invisible" />
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
                    (weekIndex === 0 && day > 7) || (weekIndex === 5 && day < 7)
                      ? "text-gray-400"
                      : ""
                  )}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex border border-gray-700 bg-gray-100 text-gray-800">
          <div className="flex flex-col border-r border-gray-300">
            <div className="p-4 text-center border-b border-gray-300">
              <span className="text-2xl font-bold">
                {hours[selectedHour - 1]}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto h-[200px]">
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  className={cn(
                    "p-2 text-center cursor-pointer hover:bg-gray-200",
                    index + 1 === selectedHour && "bg-[#8F37FF] text-white"
                  )}
                  onClick={() => setSelectedHour(index + 1)}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col border-r border-gray-300">
            <div className="p-4 text-center border-b border-gray-300">
              <span className="text-2xl font-bold">
                {minutes[selectedMinute]}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto h-[200px]">
              {minutes.map((minute, index) => (
                <div
                  key={`${minute}-${index}`}
                  className={cn(
                    "p-2 text-center cursor-pointer hover:bg-gray-200",
                    index === selectedMinute && "bg-[#8F37FF] text-white"
                  )}
                  onClick={() => setSelectedMinute(index)}
                >
                  {minute}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col border-r border-gray-300">
            <div className="p-4 text-center border-b border-gray-300">
              <span className="text-2xl font-bold">
                {seconds[selectedSecond]}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto h-[200px]">
              {seconds.map((second, index) => (
                <div
                  key={`${second}-${index}`}
                  className={cn(
                    "p-2 text-center cursor-pointer hover:bg-gray-200",
                    index === selectedSecond && "bg-[#8F37FF] text-white"
                  )}
                  onClick={() => setSelectedSecond(index)}
                >
                  {second}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="p-4 text-center border-b border-gray-300">
              <span className="text-2xl font-bold">{amPm}</span>
            </div>
            <div
              className={cn(
                "p-4 text-center cursor-pointer hover:bg-gray-200",
                amPm === "AM" && "bg-[#8F37FF] text-white"
              )}
              onClick={() => setAmPm("AM")}
            >
              AM
            </div>
            <div
              className={cn(
                "p-4 text-center cursor-pointer hover:bg-gray-200",
                amPm === "PM" && "bg-[#8F37FF] text-white"
              )}
              onClick={() => setAmPm("PM")}
            >
              PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
