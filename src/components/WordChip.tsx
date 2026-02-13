import { useState } from "react";
import { Volume2 } from "lucide-react";
import type { VocabEntry } from "@/data/hsk1-vocabulary";
import { getCardLabel } from "@/data/hsk1-vocabulary";
import { playAudio } from "@/engine/audio";

/**
 * WordChip — An open, always-visible word display with audio.
 * Used everywhere EXCEPT the Collection tab (which uses the flip-card VocabularyCard).
 * Shows hanzi, pinyin, english meaning, type badge, and audio button.
 */

interface WordChipProps {
  entry: VocabEntry;
  onAudioError?: (msg: string) => void;
  /** Visual size variant */
  size?: "sm" | "md" | "lg";
  /** If true, show a compact inline pill instead of a card */
  inline?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

const TYPE_COLORS: Record<VocabEntry["type"], string> = {
  noun: "var(--card-noun)",
  verb: "var(--card-verb)",
  adjective: "var(--card-adjective)",
  particle: "var(--card-particle)",
};

export function WordChip({
  entry,
  onAudioError,
  size = "md",
  inline = false,
  onClick,
}: WordChipProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    playAudio(entry.hanzi, onAudioError).finally(() => setIsPlaying(false));
  };

  const color = TYPE_COLORS[entry.type];
  const label = getCardLabel(entry.type);

  // ─── Inline pill variant ───
  if (inline) {
    return (
      <button
        onClick={onClick ?? handleAudio}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent/20 transition-all duration-200 group"
      >
        <span className="font-chinese text-base font-bold text-foreground group-hover:text-primary transition-colors">
          {entry.hanzi}
        </span>
        <span className="text-[10px] text-muted-foreground">{entry.pinyin}</span>
        <Volume2 className={`w-3 h-3 text-muted-foreground/60 group-hover:text-primary transition-colors ${isPlaying ? "animate-pulse" : ""}`} />
      </button>
    );
  }

  // ─── Card variant ───
  const sizeClasses = {
    sm: "p-3 max-w-[140px]",
    md: "p-4 max-w-[180px]",
    lg: "p-5 max-w-[220px]",
  };

  const hanziSize = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl ${sizeClasses[size]} w-full
        border-2 shadow-lg hover:shadow-xl transition-all duration-200
        ${onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""}
        overflow-hidden
      `}
      style={{
        borderColor: `color-mix(in oklch, ${color} 40%, transparent)`,
        background: `linear-gradient(145deg, var(--card), color-mix(in oklch, ${color} 5%, var(--card)))`,
      }}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
          style={{ background: color }}
        >
          {label}
        </span>
        <button
          onClick={handleAudio}
          className={`p-1.5 rounded-full hover:bg-muted transition-colors ${isPlaying ? "animate-pulse" : ""}`}
          aria-label={`Play ${entry.hanzi}`}
        >
          <Volume2 className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Hanzi */}
      <div className="text-center py-2">
        <p className={`font-chinese ${hanziSize[size]} font-bold text-foreground leading-none`}>
          {entry.hanzi}
        </p>
      </div>

      {/* Pinyin + English */}
      <div className="text-center space-y-0.5">
        <p className="text-sm font-semibold text-secondary">{entry.pinyin}</p>
        <p className="text-xs text-muted-foreground leading-tight">{entry.english}</p>
      </div>
    </div>
  );
}
