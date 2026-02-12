import { useState } from "react";
import { Volume2 } from "lucide-react";
import type { VocabEntry } from "@/data/hsk1-vocabulary";
import { getCardLabel } from "@/data/hsk1-vocabulary";
import { playAudio } from "@/engine/audio";

interface VocabularyCardProps {
  entry: VocabEntry;
  onAudioError?: (message: string) => void;
  isUnlocked?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const TYPE_GRADIENT: Record<VocabEntry["type"], { from: string; to: string; border: string }> = {
  noun: { from: "var(--card-noun-dark)", to: "var(--card-noun)", border: "var(--card-noun)" },
  verb: { from: "var(--card-verb-dark)", to: "var(--card-verb)", border: "var(--card-verb)" },
  adjective: { from: "var(--card-adjective-dark)", to: "var(--card-adjective)", border: "var(--card-adjective)" },
  particle: { from: "var(--card-particle-dark)", to: "var(--card-particle)", border: "var(--card-particle)" },
};

export function VocabularyCard({
  entry,
  onAudioError,
  isUnlocked = true,
  isSelected = false,
  onClick,
  compact = false,
}: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const colors = TYPE_GRADIENT[entry.type];

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    playAudio(entry.hanzi, onAudioError).finally(() => setIsPlaying(false));
  };

  const handleClick = () => {
    if (onClick) onClick();
    else setIsFlipped(!isFlipped);
  };

  const label = getCardLabel(entry.type);

  if (compact) {
    return (
      <button
        onClick={handleClick}
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          borderColor: isSelected ? "var(--secondary)" : "transparent",
          borderWidth: isSelected ? "2px" : "1px",
          borderStyle: "solid",
          boxShadow: isSelected
            ? `0 0 20px color-mix(in oklch, var(--secondary) 30%, transparent)`
            : "var(--shadow-sm)",
        }}
        className="relative group rounded-xl px-5 py-3 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="font-chinese text-3xl text-white font-bold leading-tight block">
          {entry.hanzi}
        </span>
        <span className="block text-xs text-white/80 mt-1 font-medium">{entry.pinyin}</span>
      </button>
    );
  }

  return (
    <div className="card-3d group w-full aspect-[3/4] max-w-[180px]" onClick={handleClick}>
      <div className={`card-inner w-full h-full cursor-pointer ${isFlipped ? "flipped" : ""}`}>
        {/* Front */}
        <div
          className={`
            card-front w-full h-full rounded-2xl p-4 md:p-5 flex flex-col items-center justify-between
            shadow-lg group-hover:shadow-xl transition-shadow duration-300
            ${isSelected ? "ring-2 ring-secondary" : ""}
            ${!isUnlocked ? "opacity-40 grayscale" : ""}
          `}
          style={{
            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            border: "1px solid oklch(1 0 0 / 0.15)",
          }}
        >
          <div className="self-end">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 text-white">
              {label}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <span className="font-chinese text-4xl md:text-5xl text-white font-bold drop-shadow-lg">
              {isUnlocked ? entry.hanzi : "?"}
            </span>
          </div>

          <div className="w-full flex items-center justify-between">
            <span className="text-xs md:text-sm text-white/90 font-medium">{isUnlocked ? entry.pinyin : "???"}</span>
            {isUnlocked && (
              <button
                onClick={handleAudio}
                className={`p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer ${isPlaying ? "animate-pulse" : ""}`}
                aria-label={`Play pronunciation for ${entry.hanzi}`}
              >
                <Volume2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className="card-back w-full h-full rounded-2xl p-4 md:p-5 flex flex-col shadow-lg bg-card"
          style={{
            borderColor: colors.border,
            borderWidth: "2px",
            borderStyle: "solid",
          }}
        >
          <div className="self-end">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
              style={{ background: `color-mix(in oklch, ${colors.border} 30%, transparent)` }}
            >
              {label}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-1 md:gap-2">
            <span className="font-chinese text-2xl md:text-3xl font-bold text-card-foreground">{entry.hanzi}</span>
            <span className="text-base md:text-lg font-medium text-secondary">{entry.pinyin}</span>
            <span className="text-xs md:text-sm text-center text-muted-foreground leading-tight">{entry.english}</span>
          </div>

          <div className="space-y-1 text-[10px] md:text-xs text-muted-foreground">
            {entry.radical && (
              <div className="flex justify-between">
                <span>Radical: <span className="font-chinese">{entry.radical}</span></span>
                <span className="text-foreground/70 truncate ml-1">{entry.radicalMeaning}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tone</span>
              <span className="text-foreground/70">T{entry.toneNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
