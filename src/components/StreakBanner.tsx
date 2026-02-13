import { Flame, Snowflake, Target, X } from "lucide-react";
import type { ProgressState } from "@/engine/xp";
import { getDailyProgress } from "@/engine/xp";

interface StreakBannerProps {
  progress: ProgressState;
  onDismiss: () => void;
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "You're on fire! Day 1!";
  if (streak < 7) return `${streak} days strong! Keep going!`;
  if (streak < 30) return `${streak} days! You're unstoppable!`;
  if (streak < 100) return `${streak} days! Master in the making!`;
  return `${streak} days! 🏆 Legendary!`;
}

function getFlameSize(streak: number): string {
  if (streak === 0) return "w-8 h-8";
  if (streak < 7) return "w-10 h-10";
  if (streak < 30) return "w-12 h-12";
  return "w-14 h-14";
}

function getFlameColor(streak: number): string {
  if (streak === 0) return "text-muted-foreground";
  if (streak < 7) return "text-orange-500";
  if (streak < 30) return "text-orange-400";
  return "text-yellow-400";
}

export function StreakBanner({ progress, onDismiss }: StreakBannerProps) {
  const daily = getDailyProgress(progress);
  const flameSize = getFlameSize(progress.streak);
  const flameColor = getFlameColor(progress.streak);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lg animate-slide-up">
      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4">
        {/* Flame */}
        <div className="relative flex-shrink-0">
          <div className={`${progress.streak > 0 ? "animate-pulse" : ""}`}>
            <Flame className={`${flameSize} ${flameColor} drop-shadow-lg`} />
          </div>
          {progress.streak > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {progress.streak}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-sm">{getStreakMessage(progress.streak)}</p>

          {/* Daily XP goal progress */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                Daily Goal
              </span>
              <span>
                {progress.todayXP} / {progress.dailyXPGoal} XP
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${daily.met ? "bg-success" : "bg-secondary"
                  }`}
                style={{ width: `${daily.percentage}%` }}
              />
            </div>
            {daily.met && (
              <p className="text-[10px] text-success font-bold mt-1">✨ Daily goal reached!</p>
            )}
          </div>

          {/* Streak freeze indicator */}
          {progress.streakFreezes > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Snowflake className="w-3 h-3 text-blue-400" />
              {progress.streakFreezes} streak freeze{progress.streakFreezes > 1 ? "s" : ""} available
            </div>
          )}
        </div>
      </div>

      {/* Longest streak */}
      {progress.longestStreak > progress.streak && progress.longestStreak > 0 && (
        <p className="text-[10px] text-muted-foreground/70 mt-3 text-center">
          Personal best: {progress.longestStreak} days
        </p>
      )}
    </div>
  );
}
