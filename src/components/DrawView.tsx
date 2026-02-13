import { useState, useMemo, useCallback, useEffect } from "react";
import { RotateCcw, Eye, Pencil, Play, ChevronLeft, Check, Sparkles } from "lucide-react";
import { HSK1_VOCABULARY, type VocabEntry } from "@/data/hsk1-vocabulary";
import { HanziWriter } from "./HanziWriter";

type FilterType = "all" | "noun" | "verb" | "adjective" | "particle";
type DrawMode = "animate" | "quiz";

const STORAGE_KEY = "mm-perfect-draws";

function loadPerfectDraws(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function savePerfectDraws(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

interface DrawViewProps {
  onAudioError?: (msg: string) => void;
}

export function DrawView({ onAudioError }: DrawViewProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedChar, setSelectedChar] = useState<VocabEntry | null>(null);
  const [mode, setMode] = useState<DrawMode>("animate");
  const [quizKey, setQuizKey] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [perfectDraws, setPerfectDraws] = useState<Set<string>>(loadPerfectDraws);

  // Get single characters only
  const singleCharVocab = useMemo(() => {
    const chars = HSK1_VOCABULARY.filter((v) => v.hanzi.length === 1);
    if (filter === "all") return chars;
    return chars.filter((v) => v.type === filter);
  }, [filter]);

  // Stats
  const perfectCount = useMemo(
    () => singleCharVocab.filter((v) => perfectDraws.has(v.hanzi)).length,
    [singleCharVocab, perfectDraws]
  );

  const handleSelectChar = useCallback((entry: VocabEntry) => {
    setSelectedChar(entry);
    setMode("animate");
    setCompleted(false);
    setTotalMistakes(0);
    setQuizKey((k) => k + 1);
  }, []);

  const handleStartQuiz = useCallback(() => {
    setMode("quiz");
    setCompleted(false);
    setTotalMistakes(0);
    setQuizKey((k) => k + 1);
  }, []);

  const handleRetryQuiz = useCallback(() => {
    setCompleted(false);
    setTotalMistakes(0);
    setQuizKey((k) => k + 1);
  }, []);

  const handleQuizComplete = useCallback((data: { character: string; totalMistakes: number }) => {
    setTotalMistakes(data.totalMistakes);
    setCompleted(true);

    // Mark as perfect if zero mistakes
    if (data.totalMistakes === 0) {
      setPerfectDraws((prev) => {
        const next = new Set(prev);
        next.add(data.character);
        savePerfectDraws(next);
        return next;
      });
    }
  }, []);

  const handleMistake = useCallback((data: { totalMistakes: number }) => {
    setTotalMistakes(data.totalMistakes);
  }, []);

  const filters: { value: FilterType; label: string; emoji: string }[] = [
    { value: "all", label: "All", emoji: "📝" },
    { value: "noun", label: "Nouns", emoji: "🏷️" },
    { value: "verb", label: "Verbs", emoji: "⚡" },
    { value: "adjective", label: "Adj.", emoji: "🎨" },
    { value: "particle", label: "Particles", emoji: "✨" },
  ];

  // ─── Character Detail View ───
  if (selectedChar) {
    const isPerfect = perfectDraws.has(selectedChar.hanzi);

    return (
      <div className="max-w-md mx-auto py-6 px-4 animate-fade-in">
        {/* Back row */}
        <button
          onClick={() => setSelectedChar(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to characters
        </button>

        {/* Character Info */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <p className="text-5xl font-chinese font-bold text-foreground mb-1">{selectedChar.hanzi}</p>
            {isPerfect && (
              <div className="absolute -top-1 -right-5 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-lg text-muted-foreground">{selectedChar.pinyin}</p>
          <p className="text-sm text-muted-foreground/70">{selectedChar.english}</p>
        </div>

        {/* Writer */}
        <div className="flex justify-center mb-6">
          <HanziWriter
            key={`${selectedChar.hanzi}-${mode}-${quizKey}`}
            character={selectedChar.hanzi}
            size={240}
            quiz={mode === "quiz"}
            showOutline={true}
            onComplete={handleQuizComplete}
            onMistake={handleMistake}
          />
        </div>

        {/* Quiz Result */}
        {completed && mode === "quiz" && (
          <div className="text-center mb-4 animate-bounce-in">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${totalMistakes === 0
                ? "bg-success/15 text-success"
                : "bg-warning/15 text-warning"
              }`}>
              <Check className="w-4 h-4" />
              {totalMistakes === 0
                ? "✨ Perfect! No mistakes!"
                : `Done with ${totalMistakes} mistake${totalMistakes > 1 ? "s" : ""}`}
            </div>
          </div>
        )}

        {/* Mistake counter during quiz */}
        {mode === "quiz" && !completed && totalMistakes > 0 && (
          <div className="text-center mb-4">
            <span className="text-sm text-destructive font-medium">
              Mistakes: {totalMistakes}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {mode === "animate" ? (
            <>
              <button
                onClick={() => setQuizKey((k) => k + 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
              >
                <Play className="w-4 h-4" />
                Replay
              </button>
              <button
                onClick={handleStartQuiz}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Pencil className="w-4 h-4" />
                Draw It
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMode("animate");
                  setCompleted(false);
                  setQuizKey((k) => k + 1);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Watch
              </button>
              <button
                onClick={handleRetryQuiz}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                {completed ? "Try Again" : "Retry"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Character Grid View ───
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-2xl font-bold text-foreground mb-1">
          <Sparkles className="w-6 h-6 text-secondary" />
          Stroke Practice
        </div>
        <p className="text-sm text-muted-foreground">
          {perfectCount > 0
            ? `${perfectCount} / ${singleCharVocab.length} characters mastered`
            : "Learn the correct stroke order for each character"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${filter === f.value
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
              }
            `}
          >
            <span className="mr-1.5">{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {singleCharVocab.map((entry) => {
          const isPerfect = perfectDraws.has(entry.hanzi);
          return (
            <button
              key={entry.id}
              onClick={() => handleSelectChar(entry)}
              className="group relative aspect-square rounded-2xl border border-border bg-card hover:bg-accent/30 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex flex-col items-center justify-center gap-1 p-2"
            >
              <span className="font-chinese text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                {entry.hanzi}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight truncate w-full text-center">
                {entry.pinyin}
              </span>

              {/* Perfect draw checkmark */}
              {isPerfect && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Type indicator (hidden if perfect badge) */}
              {!isPerfect && (
                <div
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full opacity-60"
                  style={{ background: `var(--card-${entry.type})` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {singleCharVocab.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No single characters found for this filter.</p>
        </div>
      )}
    </div>
  );
}
