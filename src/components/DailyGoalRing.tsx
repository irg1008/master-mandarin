import { Target } from "lucide-react";

interface DailyGoalRingProps {
  current: number;
  target: number;
}

export function DailyGoalRing({ current, target }: DailyGoalRingProps) {
  const percentage = Math.min(100, (current / target) * 100);
  const size = 32;
  const strokeWidth = 3; // Thicker as requested? Or just visible.
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const isMet = percentage >= 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${isMet ? "text-success" : "text-primary"
            }`}
        />
      </svg>

      {/* Icon in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isMet ? (
          <span className="text-[10px] ">✨</span>
        ) : (
          <Target className="w-3 h-3 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
