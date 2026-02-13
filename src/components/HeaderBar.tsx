import { Sun, Moon, Download, Upload, Share2, Flame, Zap, Monitor } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DailyGoalRing } from "@/components/DailyGoalRing";
import type { ProgressState } from "@/engine/xp";
import { getXPForLevel, getDailyProgress } from "@/engine/xp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderBarProps {
  progress: ProgressState;
  themeMode: "light" | "dark" | "system";
  resolvedTheme: "light" | "dark"; // The actual applied theme
  onSetTheme: (mode: "light" | "dark" | "system") => void;
  onExport: () => void;
  onImport: () => void;
  onShare: () => void;
}

export function HeaderBar({
  progress,
  themeMode,
  resolvedTheme,
  onSetTheme,
  onExport,
  onImport,
  onShare,
}: HeaderBarProps) {
  const xpForCurrentLevel = getXPForLevel(progress.level);
  const xpPercentage = Math.min((progress.xp / xpForCurrentLevel) * 100, 100);

  return (
    <header className="glass-card z-50 sticky top-0 md:relative width-full" style={{ borderRadius: 0 }}>
      <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-5 md:gap-6">
            <div className="relative shrink-0">
              <div
                className="w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}
              >
                <span className="font-display text-xl md:text-2xl text-primary-foreground font-bold">龍</span>
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-secondary flex items-center justify-center shadow">
                <span className="text-[10px] md:text-xs font-bold text-secondary-foreground">
                  {progress.level}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold leading-tight text-foreground">Mandarin Master</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground">Linguistic Duelist</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-1.5 mr-2">
              {[
                { icon: Download, action: onExport, title: "Export Progress" },
                { icon: Upload, action: onImport, title: "Import Progress" },
                { icon: Share2, action: onShare, title: "Share Summary" },
              ].map(({ icon: Icon, action, title }) => (
                <button
                  key={title}
                  onClick={action}
                  className="p-2.5 rounded-lg transition-all duration-200 cursor-pointer text-muted-foreground hover:text-secondary hover:bg-accent"
                  title={title}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <div className="w-px h-6 mx-2 bg-border" />
            </div>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  {resolvedTheme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSetTheme("light")} className="gap-2">
                  <Sun className="w-4 h-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSetTheme("dark")} className="gap-2">
                  <Moon className="w-4 h-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSetTheme("system")} className="gap-2">
                  <Monitor className="w-4 h-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom Row: Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
          {/* XP Bar */}
          <div className="flex items-center gap-4 flex-1">
            <DailyGoalRing current={progress.todayXP} target={progress.dailyXPGoal} />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-xs text-secondary">
                  Lv.{progress.level}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {progress.xp} / {xpForCurrentLevel} XP
                </span>
              </div>
              <Progress value={xpPercentage} className="h-2" />
            </div>
          </div>

          {/* Streak & Cards */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-muted border border-border">
              <Flame
                className="w-4 h-4 md:w-5 md:h-5"
                style={{ color: progress.streak > 0 ? "var(--flame)" : "var(--muted-foreground)" }}
              />
              <span
                className="text-xs md:text-sm font-bold"
                style={{ color: progress.streak > 0 ? "var(--flame)" : "var(--muted-foreground)" }}
              >
                {progress.streak} <span className="sm:hidden ml-1 font-normal text-muted-foreground">Day Streak</span>
              </span>
            </div>

            <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-muted border border-border">
              <span className="text-[10px] md:text-xs text-muted-foreground">Cards:</span>
              <span className="text-xs md:text-sm font-bold text-foreground">
                {progress.unlockedCards.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
