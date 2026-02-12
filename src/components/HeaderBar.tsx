import { Sun, Moon, Download, Upload, Share2, Flame, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import type { ProgressState } from "@/engine/xp";
import { getXPForLevel } from "@/engine/xp";

interface HeaderBarProps {
  progress: ProgressState;
  isDarkMode: boolean;
  onToggleMode: () => void;
  onExport: () => void;
  onImport: () => void;
  onShare: () => void;
}

export function HeaderBar({
  progress,
  isDarkMode,
  onToggleMode,
  onExport,
  onImport,
  onShare,
}: HeaderBarProps) {
  const xpForCurrentLevel = getXPForLevel(progress.level);
  const xpPercentage = Math.min((progress.xp / xpForCurrentLevel) * 100, 100);

  return (
    <header className="glass-card" style={{ borderRadius: 0 }}>
      <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="relative shrink-0">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}
              >
                <span className="font-display text-xl md:text-2xl text-primary-foreground font-bold">龍</span>
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-secondary flex items-center justify-center shadow">
                <span className="text-[9px] md:text-[10px] font-bold text-secondary-foreground">
                  {progress.level}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold leading-tight text-foreground">Mandarin Master</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground">Linguistic Duelist · HSK 3.0</p>
            </div>

            {/* Mobile: Mode Toggle in Header */}
            <div className="ml-auto md:hidden">
              <button onClick={onToggleMode} className="p-2 rounded-lg text-muted-foreground hover:bg-accent">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Actions - Desktop & Tablet */}
          <div className="hidden md:flex items-center gap-1.5">
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

            <div className="w-px h-7 mx-2 bg-border" />

            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <Switch checked={isDarkMode} onCheckedChange={onToggleMode} />
              <Moon className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Actions - Mobile Row */}
          <div className="flex md:hidden w-full items-center justify-between gap-2 mt-1">
            <div className="flex gap-1">
              {[
                { icon: Download, action: onExport },
                { icon: Upload, action: onImport },
                { icon: Share2, action: onShare },
              ].map(({ icon: Icon, action }) => (
                <button
                  key={action.name} // basic key
                  onClick={action}
                  className="p-2 rounded-lg bg-muted/50 text-muted-foreground"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
          {/* XP Bar */}
          <div className="flex-1 space-y-1.5 order-2 sm:order-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-secondary">
                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="font-bold text-sm">Lv.{progress.level}</span>
              </div>
              <span className="text-muted-foreground text-[10px] md:text-xs">
                {progress.xp} / {xpForCurrentLevel} XP
              </span>
            </div>
            <Progress value={xpPercentage} className="h-2 md:h-2.5" />
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
