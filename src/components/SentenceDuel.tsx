import { useState, useCallback, useEffect, useRef } from "react";
import { Swords, RotateCcw, Zap, Trophy, ChevronRight } from "lucide-react";
import type { VocabEntry } from "@/data/hsk1-vocabulary";
import { HSK1_VOCABULARY } from "@/data/hsk1-vocabulary";
import { generateQuest, checkAnswer, getXPForStreak, type QuestCard } from "@/engine/duel";
import correctSoundParams from "@/assets/sounds/correct.mp3";
import { playAudio } from "@/engine/audio";

interface SentenceDuelProps {
  onXPEarned: (xp: number) => void;
  onDuelComplete: (won: boolean) => void;
  streak: number;
  onAudioError?: (message: string) => void;
  mode?: "practice" | "lesson";
  lessonVocabulary?: VocabEntry[];
  unlockedCards?: string[];
}

export function SentenceDuel({
  onXPEarned,
  onDuelComplete,
  streak,
  onAudioError,
  mode = "practice",
  lessonVocabulary = [],
  unlockedCards = [],
}: SentenceDuelProps) {
  const [quest, setQuest] = useState<QuestCard | null>(null);
  const [placedCards, setPlacedCards] = useState<VocabEntry[]>([]);
  const [availableCards, setAvailableCards] = useState<VocabEntry[]>([]);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  // Revision key to force React to re-mount the card (prevents flip-stuck bug)
  const [questRevision, setQuestRevision] = useState(0);

  const playSuccessSound = useCallback(() => {
    const audio = new Audio(correctSoundParams);
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Failed to play success sound:", err));
  }, []);

  const getSourcePool = useCallback(() => {
    if (mode === "lesson") return lessonVocabulary;
    if (mode === "practice" && unlockedCards.length > 0) {
      const pool = HSK1_VOCABULARY.filter((v) => unlockedCards.includes(v.id));
      return pool.length < 5 ? HSK1_VOCABULARY.slice(0, 10) : pool;
    }
    return HSK1_VOCABULARY;
  }, [mode, lessonVocabulary, unlockedCards]);

  const startNewQuest = useCallback(() => {
    const sourcePool = getSourcePool();
    const newQuest = generateQuest(sourcePool, difficulty);
    setQuest(newQuest);
    setPlacedCards([]);
    setAvailableCards(newQuest?.shuffledCards || []);
    setResult(null);
    setEarnedXP(0);
    setShowXPAnimation(false);
    setShowAnswer(false);
    setQuestRevision((r) => r + 1);
  }, [difficulty, getSourcePool]);

  // Stable ref for init
  const startNewQuestRef = useRef(startNewQuest);
  startNewQuestRef.current = startNewQuest;

  useEffect(() => {
    startNewQuestRef.current();
  }, [difficulty]);

  const handleCardPlace = (card: VocabEntry) => {
    if (result) return;
    setPlacedCards((prev) => [...prev, card]);
    const indexToRemove = availableCards.findIndex((c) => c.id === card.id);
    if (indexToRemove !== -1) {
      setAvailableCards((prev) => {
        const next = [...prev];
        next.splice(indexToRemove, 1);
        return next;
      });
    }
    playAudio(card.hanzi, onAudioError);
  };

  const handleRemoveCard = (index: number) => {
    if (result) return;
    const cardToRemove = placedCards[index];
    setPlacedCards((prev) => prev.filter((_, i) => i !== index));
    setAvailableCards((prev) => [...prev, cardToRemove]);
  };

  const handleCheck = () => {
    if (!quest || placedCards.length !== quest.targetOrder.length) return;
    const isCorrect = checkAnswer(quest, placedCards);
    setResult(isCorrect ? "correct" : "incorrect");
    setShowAnswer(true);

    if (isCorrect) {
      playSuccessSound();
      const xp = getXPForStreak(quest.xpReward, streak);
      setEarnedXP(xp);
      setShowXPAnimation(true);
      onXPEarned(xp);
      // Don't call onDuelComplete here — call it on "Next" to avoid re-render race
    }
  };

  const handleNext = () => {
    if (result === "correct") {
      onDuelComplete(true);
    } else {
      onDuelComplete(false);
    }
    // Immediately reset and start new quest (no setTimeout — use questRevision key to force re-mount)
    startNewQuest();
  };

  if (!quest) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: `color-mix(in oklch, var(--primary) 10%, transparent)` }}
        >
          <Swords className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-lg text-muted-foreground">
          {mode === "lesson" ? "Not enough words to generate a quest." : "Unlock more cards to start dueling!"}
        </p>
        <button
          onClick={() => startNewQuest()}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const isCorrect = result === "correct";
  const isLessonMode = mode === "lesson";

  if (isLessonMode) {
    // ─────────────────────────────────────────────
    // Lesson Mode Layout (Flat, consistent with MC)
    // ─────────────────────────────────────────────
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        {/* Header / Prompt */}
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Swords className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Translate this sentence
          </p>
          <p className="text-xl md:text-2xl font-bold text-foreground leading-snug px-4">
            {quest.english}
          </p>
        </div>

        {/* Construction Area */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full min-h-[80px] p-4 rounded-xl bg-muted/50 border-2 border-dashed border-border flex flex-wrap items-center justify-center gap-2 transition-colors hover:border-primary/50">
            {placedCards.length === 0 && (
              <span className="text-muted-foreground text-sm font-medium animate-pulse text-center">
                Tap words below
              </span>
            )}
            {placedCards.map((card, idx) => (
              <button
                key={`placed-${idx}`}
                onClick={() => handleRemoveCard(idx)}
                className="animate-pop-in"
                disabled={showAnswer}
              >
                <div className="px-3 py-2 bg-background border border-border rounded-lg shadow-sm flex flex-col items-center">
                  <span className="text-lg font-chinese font-bold leading-none">{card.hanzi}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Action Button (only if not answered) */}
          {!showAnswer && (
            <button
              onClick={handleCheck}
              disabled={placedCards.length === 0}
              className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              Check Answer
            </button>
          )}
        </div>

        {/* Word Bank (Hidden if answered) */}
        {!showAnswer && (
          <div className="flex flex-wrap justify-center gap-2">
            <div data-testid="solution-hint" data-solution={quest?.targetOrder.map(c => c.id).join(',') || ''} style={{ display: 'none' }} />
            {availableCards.map((card, idx) => (
              <button
                key={`avail-${card.id}-${idx}`}
                onClick={() => handleCardPlace(card)}
                data-testid={`word-bank-item-${card.id}`}
                className="group transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
              >
                <div className="px-4 py-2 bg-card border border-border rounded-xl shadow-sm group-hover:border-primary/50 flex flex-col items-center min-w-[4rem]">
                  <span className="text-lg font-chinese font-bold text-foreground">{card.hanzi}</span>
                  <span className="text-[10px] text-muted-foreground">{card.pinyin}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Result Banner (Shown if answered) */}
        {showAnswer && (
          <div className="space-y-4 animate-slide-up bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? "bg-success/20" : "bg-destructive/20"}`}>
                {isCorrect ? <Trophy className="w-5 h-5 text-success" /> : <RotateCcw className="w-5 h-5 text-destructive" />}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
                  {isCorrect ? "Excellent!" : "Correct Solution:"}
                </h3>
                {!isCorrect && (
                  <div className="mt-1">
                    <p className="font-chinese text-xl font-bold text-foreground">
                      {quest.targetOrder.map((w) => w.hanzi).join("")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {quest.targetOrder.map((w) => w.pinyin).join(" ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {showXPAnimation && (
              <div className="text-center animate-bounce text-secondary font-bold">
                +{earnedXP} XP ⚡
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Next Challenge <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Practice Mode Layout (Original Card Style)
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Quest Card */}
      <div className="flex justify-center animate-slide-up" key={`quest-${questRevision}`}>
        <div className="relative w-full max-w-md h-[400px] group perspective-1000">
          <div
            className="relative w-full h-full transform-style-3d transition-all duration-700"
            style={{ transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden w-full h-full bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl text-center flex flex-col items-center gap-4 md:gap-6">
              <FrontContent quest={quest} xpReward={quest.xpReward} streak={streak} mode={mode} />
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 backface-hidden w-full h-full bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl text-center flex flex-col items-center justify-center gap-4"
              style={{ transform: "rotateY(180deg)" }}
            >
              <BackContent
                isCorrect={isCorrect}
                quest={quest}
                earnedXP={earnedXP}
                showXPAnimation={showXPAnimation}
                onNext={handleNext}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sentence Construction Area */}
      <div className="flex flex-col items-center gap-4 md:gap-6 w-full max-w-2xl mx-auto px-4">
        <div className="w-full min-h-[80px] md:min-h-[100px] p-4 rounded-xl bg-muted/50 border-2 border-dashed border-border flex flex-wrap items-center justify-center gap-2 md:gap-3 transition-colors hover:border-primary/50">
          {placedCards.length === 0 && (
            <span className="text-muted-foreground text-sm font-medium animate-pulse text-center">
              Tap words below to build the sentence
            </span>
          )}
          {placedCards.map((card, idx) => (
            <button
              key={`placed-${idx}`}
              onClick={() => handleRemoveCard(idx)}
              className="animate-pop-in"
              disabled={showAnswer}
            >
              <div className="px-3 md:px-4 py-2 bg-background border border-border rounded-lg shadow-sm hover:border-destructive hover:text-destructive transition-colors flex flex-col items-center">
                <span className="text-lg md:text-xl font-chinese font-bold leading-none">{card.hanzi}</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">{card.pinyin}</span>
                <span className="text-[9px] text-muted-foreground/70 leading-none mt-0.5">{card.english}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCheck}
          disabled={showAnswer || placedCards.length === 0}
          className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 rounded-xl bg-secondary text-secondary-foreground font-bold shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
        >
          Check Answer
        </button>
      </div>

      {/* Word Bank */}
      <div className="w-full max-w-3xl mx-auto px-2">
        {/* Solution Hint for E2E Testing */}
        <div data-testid="solution-hint" data-solution={quest?.targetOrder.map(c => c.id).join(',') || ''} style={{ display: 'none' }} />

        {!showAnswer && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {availableCards.map((card, idx) => (
              <button
                key={`avail-${card.id}-${idx}`}
                onClick={() => handleCardPlace(card)}
                disabled={showAnswer}
                data-testid={`word-bank-item-${card.id}`}
                data-card-id={card.id}
                className="group relative transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:pointer-events-none disabled:opacity-40"
              >
                <div className="px-3 md:px-5 py-2 md:py-3 bg-card border border-border rounded-xl shadow-sm group-hover:shadow-md group-hover:border-primary/50 transition-all flex flex-col items-center min-w-17.5">
                  <span className="text-lg md:text-xl font-chinese font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.hanzi}
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                    {card.pinyin}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components for cleaner render logic

function FrontContent({ quest, xpReward, streak, mode }: { quest: QuestCard; xpReward: number; streak: number; mode: string }) {
  return (
    <>
      <div className="mt-2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <Swords className="w-6 h-6 md:w-8 md:h-8 text-primary" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Translate this
        </h3>
        <p className="text-xl md:text-2xl font-bold text-foreground leading-snug">
          {quest.english}
        </p>
      </div>
      <div className="w-full h-px bg-border/50" />
      <div className="flex gap-4 text-sm text-muted-foreground mb-2">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-secondary" />
          <span>+{quest.xpReward} XP</span>
        </div>
        {mode === "practice" && (
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-primary" />
            <span>Win Streak: {streak}</span>
          </div>
        )}
      </div>
    </>
  );
}

function BackContent({ isCorrect, quest, earnedXP, showXPAnimation, onNext }: {
  isCorrect: boolean;
  quest: QuestCard;
  earnedXP: number;
  showXPAnimation: boolean;
  onNext: () => void;
}) {
  return (
    <>
      <div
        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 ${isCorrect ? "bg-success/20" : "bg-destructive/20"
          }`}
      >
        {isCorrect ? (
          <Trophy className="w-6 h-6 md:w-8 md:h-8 text-success" />
        ) : (
          <RotateCcw className="w-6 h-6 md:w-8 md:h-8 text-destructive" />
        )}
      </div>
      <div>
        <h3
          className={`text-xl md:text-2xl font-bold mb-2 ${isCorrect ? "text-success" : "text-destructive"
            }`}
        >
          {isCorrect ? "Excellent!" : "Try Again"}
        </h3>
        <p className="text-foreground/80 font-chinese text-2xl md:text-3xl font-bold">
          {quest.targetOrder.map((w) => w.hanzi).join("")}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {quest.targetOrder.map((w) => w.pinyin).join(" ")}
        </p>
      </div>
      {showXPAnimation && (
        <div className="animate-bounce text-secondary font-bold text-lg">
          +{earnedXP} XP ⚡
        </div>
      )}
      <button
        onClick={onNext}
        className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        Next Challenge <ChevronRight className="w-4 h-4" />
      </button>
    </>
  );
}
