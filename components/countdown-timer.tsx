"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CountdownTimerProps {
  endTime: Date;
  onComplete?: () => void;
  showSetOutcomeButton?: boolean;
  targetId?: string;
}

export function CountdownTimer({
  endTime,
  onComplete,
  showSetOutcomeButton = false,
  targetId,
}: CountdownTimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsCompleted(true);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  const handleSetOutcome = () => {
    router.push(`/manage-targets/set-outcome?id=${targetId}`);
  };

  return (
    <div className="bg-[#170a2c2e] p-3 rounded-md text-center">
      {isCompleted && showSetOutcomeButton ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-white mb-1">Time has ended!</p>
          <button
            onClick={handleSetOutcome}
            className="bg-[#8F37FF] text-white px-4 py-2 rounded-md hover:bg-[#8F37FF]/80"
          >
            Set Outcome
          </button>
        </div>
      ) : (
        <>
          {/* <p className="text-xs text-white mb-1">Hurry up! Time ends in:</p> */}
          <div className="flex gap-2 text-white">
            <div className="bg-[#170a2c42] p-1 rounded">
              <span className="text-lg">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-xs block">Hours</span>
            </div>
            <span className="text-lg">:</span>
            <div className="bg-[#170a2c42] p-1 rounded">
              <span className="text-lg">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-xs block">Mins</span>
            </div>
            <span className="text-lg">:</span>
            <div className="bg-[#170a2c42] p-1 rounded">
              <span className="text-lg">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-xs block">Secs</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
