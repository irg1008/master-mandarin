import { useState, useCallback, useEffect } from "react";
import { Swords, RotateCcw, Zap, Trophy, ChevronRight } from "lucide-react";
import type { VocabEntry } from "@/data/hsk1-vocabulary";
import { HSK1_VOCABULARY } from "@/data/hsk1-vocabulary";
import { generateQuest, checkAnswer, getXPForStreak, type QuestCard } from "@/engine/duel";
import { VocabularyCard } from "./VocabularyCard";
import correctSoundParams from "@/assets/sounds/correct.mp3";
import { playAudio } from "@/engine/audio";

interface SentenceDuelProps {
  onXPEarned: (xp: number) => void;
  onDuelComplete: (won: boolean) => void;
  streak: number;
  onAudioError?: (message: string) => void;
}

export function SentenceDuel({ onXPEarned, onDuelComplete, streak, onAudioError }: SentenceDuelProps) {
  const [quest, setQuest] = useState<QuestCard | null>(null);
  const [placedCards, setPlacedCards] = useState<VocabEntry[]>([]);
  const [availableCards, setAvailableCards] = useState<VocabEntry[]>([]);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const playSuccessSound = useCallback(() => {
    const audio = new Audio(correctSoundParams);
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Failed to play success sound:", err));
  }, []);

  const startNewQuest = useCallback(() => {
    const newQuest = generateQuest(HSK1_VOCABULARY, difficulty);
    setQuest(newQuest);
    setPlacedCards([]);
    setAvailableCards(newQuest?.shuffledCards || []);
    setResult(null);
    setEarnedXP(0);
    setShowXPAnimation(false);
    setShowAnswer(false);
  }, [difficulty]);

  useEffect(() => {
    startNewQuest();
  }, [startNewQuest]);

  const handleCardPlace = (card: VocabEntry) => {
    if (result) return;
    // Don't add if already placed (unique safeguard for this UI)
    if (placedCards.includes(card)) return;

    // Play pronunciation
    playAudio(card.hanzi, onAudioError);

    const newPlaced = [...placedCards, card];
    setPlacedCards(newPlaced);
  };

  const handleRemoveCard = (index: number) => {
    if (result) return;
    setPlacedCards(placedCards.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    if (quest && placedCards.length === quest.targetOrder.length) {
      const isCorrect = checkAnswer(quest, placedCards);
      setResult(isCorrect ? "correct" : "incorrect");
      setShowAnswer(true);

      if (isCorrect) {
        playSuccessSound(); // Play success sound
        const xp = getXPForStreak(quest.xpReward, streak);
        setEarnedXP(xp);
        setShowXPAnimation(true);
        onXPEarned(xp);
        onDuelComplete(true);
      } else {
        onDuelComplete(false);
      }
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    // Short delay to allow flip animation to start back
    setTimeout(() => startNewQuest(), 300);
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
        <p className="text-lg text-muted-foreground">No quest available for this difficulty.</p>
        <button
          onClick={startNewQuest}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isCorrect = result === "correct";

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Quest Card */}
      <div className="flex justify-center animate-slide-up">
        <div className="relative group perspective-1000 w-full max-w-md h-[400px]">
          <div
            className="relative w-full h-full transform-style-3d transition-all duration-700"
            style={{ transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Front: Challenge */}
            <div className="absolute inset-0 backface-hidden w-full h-full bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl text-center flex flex-col items-center gap-4 md:gap-6">
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
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span>Win Streak: {streak}</span>
                </div>
              </div>
            </div>

            {/* Back: Result */}
            <div
              className="absolute inset-0 backface-hidden w-full h-full bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl text-center flex flex-col items-center justify-center gap-4"
              style={{ transform: "rotateY(180deg)" }}
            >
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
              <button
                onClick={handleNext}
                className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Next Challenge <ChevronRight className="w-4 h-4" />
              </button>
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
                <span className="text-[10px] text-muted-foreground leading-none mt-1">{card.pinyin}</span>
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
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {availableCards.map((card, idx) => {
            const isPlaced = placedCards.includes(card);
            return (
              <button
                key={`avail-${idx}`}
                onClick={() => handleCardPlace(card)}
                disabled={showAnswer || isPlaced}
                className="group relative transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:pointer-events-none disabled:opacity-40"
              >
                <div className="px-3 md:px-5 py-2 md:py-3 bg-card border border-border rounded-xl shadow-sm group-hover:shadow-md group-hover:border-primary/50 transition-all flex flex-col items-center">
                  <span className="text-lg md:text-xl font-chinese font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.hanzi}
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                    {card.pinyin}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
