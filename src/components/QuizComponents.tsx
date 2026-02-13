import { useState, useCallback, useMemo, useEffect } from "react";
import { Check, X, Volume2, ChevronRight } from "lucide-react";
import type { VocabEntry } from "@/data/hsk1-vocabulary";
import { HSK1_VOCABULARY } from "@/data/hsk1-vocabulary";
import { playAudio } from "@/engine/audio";
import correctSoundParams from "@/assets/sounds/correct.mp3";

function playSuccessSound() {
  const audio = new Audio(correctSoundParams);
  audio.volume = 0.5;
  audio.play().catch((err) => console.error("Failed to play success sound:", err));
}

function shuffle<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

// ─────────────────────────────────────────────
// Quiz Type: Multiple Choice
// ─────────────────────────────────────────────

export type MCDirection = "hanzi-to-english" | "english-to-hanzi" | "audio-to-hanzi";

interface MultipleChoiceQuizProps {
  vocabulary: VocabEntry[];
  direction?: MCDirection;
  onCorrect: () => void;
  onIncorrect: () => void;
  onNext: () => void;
  onAudioError?: (msg: string) => void;
}

export function MultipleChoiceQuiz({
  vocabulary,
  direction = "hanzi-to-english",
  onCorrect,
  onIncorrect,
  onNext,
  onAudioError,
}: MultipleChoiceQuizProps) {
  const quiz = useMemo(() => {
    if (vocabulary.length === 0) return null;
    const correct = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    const distractorPool = HSK1_VOCABULARY.filter((v) => v.id !== correct.id);
    const distractors = shuffle(distractorPool).slice(0, 3);
    return { correct, options: shuffle([correct, ...distractors]) };
  }, [vocabulary]);

  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  // Auto-play audio on mount for audio-to-hanzi direction
  useEffect(() => {
    if (direction === "audio-to-hanzi" && quiz) {
      playAudio(quiz.correct.hanzi, onAudioError);
    }
  }, [direction, quiz, onAudioError]);

  if (!quiz) return null;
  const { correct, options } = quiz;

  const handleSelect = (option: VocabEntry) => {
    if (answered) return;
    setSelected(option.id);
    setAnswered(true);

    // Play audio for the selected Chinese character
    if (direction !== "hanzi-to-english") {
      playAudio(option.hanzi, onAudioError);
    }

    if (option.id === correct.id) {
      playSuccessSound();
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  const isCorrectAnswer = selected === correct.id;

  // ─── Prompt area ───
  const prompt =
    direction === "hanzi-to-english" ? (
      <div className="text-center">
        <button
          onClick={() => playAudio(correct.hanzi, onAudioError)}
          className="group inline-flex flex-col items-center gap-1"
        >
          <p className="font-chinese text-5xl font-bold text-foreground mb-1">{correct.hanzi}</p>
          <p className="text-sm text-muted-foreground">{correct.pinyin}</p>
          <Volume2 className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors mt-1" />
        </button>
      </div>
    ) : direction === "english-to-hanzi" ? (
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">{correct.english}</p>
      </div>
    ) : (
      <div className="text-center">
        <button
          onClick={() => playAudio(correct.hanzi, onAudioError)}
          className="w-20 h-20 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center mx-auto active:scale-95"
        >
          <Volume2 className="w-10 h-10 text-primary" />
        </button>
        <p className="text-sm text-muted-foreground mt-3">Tap to listen again</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          {direction === "hanzi-to-english"
            ? "What does this mean?"
            : direction === "english-to-hanzi"
              ? "Select the correct character"
              : "What do you hear?"}
        </p>
        {prompt}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isThis = selected === option.id;
          const isCorrectOption = option.id === correct.id;
          let borderClass = "border-border hover:border-primary/50";
          let bgClass = "bg-card";

          if (answered) {
            if (isCorrectOption) {
              borderClass = "border-success";
              bgClass = "bg-success/10";
            } else if (isThis && !isCorrectOption) {
              borderClass = "border-destructive";
              bgClass = "bg-destructive/10";
            }
          }

          // Show both hanzi+english context where appropriate
          const showChinese = direction !== "hanzi-to-english";

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={answered}
              data-testid={`mc-option-${option.id}`}
              data-is-correct={isCorrectOption}
              className={`relative w-full p-4 rounded-xl border-2 ${borderClass} ${bgClass} text-left transition-all duration-200 ${!answered ? "hover:scale-[1.02] active:scale-[0.98] cursor-pointer" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                {showChinese ? (
                  <>
                    <span className="font-chinese text-2xl font-bold text-foreground">{option.hanzi}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{option.pinyin}</span>
                      {answered && <span className="text-xs text-muted-foreground/70">{option.english}</span>}
                    </div>
                  </>
                ) : (
                  <span className="font-semibold text-base">{option.english}</span>
                )}
              </div>
              {answered && isCorrectOption && (
                <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
              )}
              {answered && isThis && !isCorrectOption && (
                <X className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result + Next */}
      {answered && (
        <div className="space-y-3 animate-slide-up">
          <div
            className={`text-center p-3 rounded-xl font-bold text-sm ${isCorrectAnswer ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
              }`}
          >
            {isCorrectAnswer
              ? "✨ Correct!"
              : `Wrong — the answer is "${correct.english}" (${correct.hanzi} ${correct.pinyin})`}
          </div>
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz Type: Matching Pairs
// ─────────────────────────────────────────────

interface MatchingPairsQuizProps {
  vocabulary: VocabEntry[];
  onCorrect: () => void;
  onIncorrect: () => void;
  onNext: () => void;
  onAudioError?: (msg: string) => void;
}

export function MatchingPairsQuiz({
  vocabulary,
  onCorrect,
  onIncorrect,
  onNext,
  onAudioError,
}: MatchingPairsQuizProps) {
  const pairs = useMemo(() => {
    return shuffle(vocabulary).slice(0, Math.min(4, vocabulary.length));
  }, [vocabulary]);

  const leftItems = useMemo(() => shuffle(pairs.map((p) => ({ id: p.id, label: p.hanzi, pinyin: p.pinyin }))), [pairs]);
  const rightItems = useMemo(() => shuffle(pairs.map((p) => ({ id: p.id, label: p.english }))), [pairs]);

  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const allMatched = matched.size === pairs.length;

  const handleLeftClick = (item: { id: string; label: string }) => {
    if (matched.has(item.id)) return;
    setSelectedLeft(item.id);
    setWrongPair(null);
    // Play audio when selecting a Chinese character
    playAudio(item.label, onAudioError);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft || matched.has(id)) return;

    if (selectedLeft === id) {
      setMatched((prev) => new Set([...prev, id]));
      setSelectedLeft(null);
      playSuccessSound();
      onCorrect();
    } else {
      setWrongPair({ left: selectedLeft, right: id });
      setMistakes((m) => m + 1);
      onIncorrect();
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
      }, 600);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Match the pairs
        </p>
        <p className="text-sm text-muted-foreground">{matched.size} / {pairs.length} matched</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left — Hanzi */}
        <div className="space-y-3">
          {leftItems.map((item) => {
            const isMatched = matched.has(item.id);
            const isSelected = selectedLeft === item.id;
            const isWrong = wrongPair?.left === item.id;

            return (
              <button
                key={`l-${item.id}`}
                onClick={() => handleLeftClick(item)}
                disabled={isMatched}
                data-testid={`match-left-${item.id}`}
                data-pair-id={item.id}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-center ${isMatched
                  ? "border-success/50 bg-success/10 opacity-60"
                  : isWrong
                    ? "border-destructive bg-destructive/10 animate-shake"
                    : isSelected
                      ? "border-primary bg-primary/10 scale-105 shadow-md"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
              >
                <span className="font-chinese text-xl font-bold">{item.label}</span>
                <span className="block text-[10px] text-muted-foreground">{item.pinyin}</span>
              </button>
            );
          })}
        </div>

        {/* Right — English */}
        <div className="space-y-3">
          {rightItems.map((item) => {
            const isMatched = matched.has(item.id);
            const isWrong = wrongPair?.right === item.id;

            return (
              <button
                key={`r-${item.id}`}
                onClick={() => handleRightClick(item.id)}
                disabled={isMatched || !selectedLeft}
                data-testid={`match-right-${item.id}`}
                data-pair-id={item.id}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-center ${isMatched
                  ? "border-success/50 bg-success/10 opacity-60"
                  : isWrong
                    ? "border-destructive bg-destructive/10 animate-shake"
                    : "border-border bg-card hover:border-primary/50"
                  }`}
              >
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="space-y-3 animate-slide-up">
          <div
            className={`text-center p-3 rounded-xl font-bold text-sm ${mistakes === 0 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
              }`}
          >
            {mistakes === 0 ? "✨ Perfect matching!" : `Completed with ${mistakes} mistake${mistakes > 1 ? "s" : ""}`}
          </div>
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
