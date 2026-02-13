import { useState, useCallback, useMemo, useEffect } from "react";
import { ChevronRight, CheckCircle, RotateCcw, Heart, X, Sparkles, Volume2 } from "lucide-react";
import type { Lesson, VocabEntry } from "@/data/hsk1-vocabulary";
import { HSK1_VOCABULARY } from "@/data/hsk1-vocabulary";
import { SentenceDuel } from "./SentenceDuel";
import { WordChip } from "./WordChip";
import { MultipleChoiceQuiz, MatchingPairsQuiz, type MCDirection } from "./QuizComponents";
import { TheorySlide } from "./TheorySlide";
import { playAudio } from "@/engine/audio";
import { triggerConfetti } from "@/engine/confetti";
import { GRAMMAR_POINTS, type GrammarPoint } from "@/data/hsk1-vocabulary";

interface LessonSessionProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
  onAudioError?: (msg: string) => void;
  unlockedCards?: string[];
}

type QuizStep =
  | { type: "theory"; point: GrammarPoint }
  | { type: "intro" }
  | { type: "mc"; direction: MCDirection }
  | { type: "matching" }
  | { type: "sentence" }
  | { type: "victory" };

const MAX_HEARTS = 5;

export function LessonSession({
  lesson,
  onComplete,
  onExit,
  onAudioError,
  unlockedCards = [],
}: LessonSessionProps) {
  // Resolve vocabulary for this lesson
  const lessonVocab = useMemo(
    () =>
      lesson.newWords
        .map((id: string) => HSK1_VOCABULARY.find((v) => v.id === id))
        .filter(Boolean) as VocabEntry[],
    [lesson.newWords]
  );

  // Build the quiz step sequence
  // Build the quiz step sequence dynamically based on lesson vocab
  const steps = useMemo<QuizStep[]>(() => {
    const s: QuizStep[] = [];

    // 0. Theory / Grammar (if any)
    if (lesson.grammarPoints) {
      lesson.grammarPoints.forEach((gid) => {
        const point = GRAMMAR_POINTS.find((gp) => gp.id === gid);
        if (point) {
          s.push({ type: "theory", point });
        }
      });
    }

    // 1. Intro loop (teach all words first)
    // We can group them or do them one by one. Let's do a slideshow of all new words first.
    s.push({ type: "intro" });

    // 2. Mix of quizzes for reinforcement
    // For each word, we want at least:
    // - 1x Hanzi -> English (Recognition)
    // - 1x Audio -> Hanzi (Listening)
    // - 1x Sentence/Context (Application)

    // Create a pool of reinforcement steps
    const reinforcementSteps: QuizStep[] = [];

    lessonVocab.forEach((word) => {
      // Recognition
      reinforcementSteps.push({ type: "mc", direction: "hanzi-to-english" });
      // Listening
      reinforcementSteps.push({ type: "mc", direction: "audio-to-hanzi" });
    });

    // Shuffle reinforcement steps so it's not predictable
    for (let i = reinforcementSteps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reinforcementSteps[i], reinforcementSteps[j]] = [reinforcementSteps[j], reinforcementSteps[i]];
    }

    // Add them to the main sequence
    s.push(...reinforcementSteps);

    // 3. Mid-lesson break: Matching Pairs (if enough words)
    if (lessonVocab.length >= 3) {
      s.push({ type: "matching" });
    }

    // 4. Harder Challenge: Sentence Construction
    // Add 2-3 sentence challenges using lesson words
    s.push({ type: "sentence" });
    s.push({ type: "sentence" });
    if (lessonVocab.length > 5) s.push({ type: "sentence" });

    // 5. Final Review: English -> Hanzi (Recall)
    lessonVocab.forEach((_) => {
      // Pick random words for final recall check, but limited to avoid fatigue
      if (Math.random() > 0.5) s.push({ type: "mc", direction: "english-to-hanzi" });
    });

    s.push({ type: "victory" });
    return s;
  }, [lessonVocab]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [introIndex, setIntroIndex] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizKey, setQuizKey] = useState(0); // force re-mount of quiz components

  const currentStep = steps[currentStepIndex];
  const totalQuizSteps = steps.filter((s) => s.type !== "intro" && s.type !== "victory").length;
  const completedQuizSteps = steps
    .slice(0, currentStepIndex)
    .filter((s) => s.type !== "intro" && s.type !== "victory").length;
  const progress = totalQuizSteps > 0 ? (completedQuizSteps / totalQuizSteps) * 100 : 0;

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((i) => i + 1);
    setQuizKey((k) => k + 1);
  }, []);

  const handleCorrect = useCallback(() => {
    setXpEarned((xp) => xp + 10);
  }, []);

  const handleIncorrect = useCallback(() => {
    setHearts((h) => Math.max(0, h - 1));
  }, []);

  // ─── Hearts depleted ───
  if (hearts === 0 && currentStep.type !== "victory") {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-destructive" fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Out of Hearts!</h2>
        <p className="text-muted-foreground mb-8">
          Don't worry — practice makes perfect. Try this lesson again!
        </p>
        <div className="flex gap-3">
          <button
            onClick={onExit}
            className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium"
          >
            Back to Roadmap
          </button>
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setHearts(MAX_HEARTS);
              setXpEarned(0);
              setIntroIndex(0);
              setQuizKey((k) => k + 1);
            }}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Top Bar (progress + hearts + exit) ───
  const topBar = currentStep.type !== "victory" && (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pb-4 pt-2 px-2">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        {/* Exit */}
        <button onClick={onExit} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Progress bar (thicker/more prominent) */}
        <div className="flex-1 h-4 rounded-full bg-muted/50 overflow-hidden border border-border/50">
          <div
            className="h-full rounded-full bg-success transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,197,94,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1">
          <Heart className="w-5 h-5 text-destructive" fill="currentColor" />
          <span className="text-sm font-bold text-destructive">{hearts}</span>
        </div>
      </div>
    </div>
  );


  // ─── Theory Step ───
  if (currentStep.type === "theory") {
    return (
      <div className="max-w-md mx-auto py-6 px-4 animate-fade-in">
        {topBar}
        <TheorySlide point={currentStep.point} onNext={goToNextStep} />
      </div>
    );
  }

  // ─── Intro Step ───
  if (currentStep.type === "intro") {
    const currentWord = lessonVocab[introIndex];
    if (!currentWord) return null;

    return (
      <div className="max-w-md mx-auto py-6 px-4 animate-fade-in">
        {topBar}

        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-foreground">New Words</h2>
          <p className="text-sm text-muted-foreground">
            {introIndex + 1} / {lessonVocab.length}
          </p>
        </div>

        {/* Word Card — always open (flip cards are Collection-only) */}
        <div className="flex justify-center mb-6">
          <WordChip
            entry={currentWord}
            size="lg"
            onAudioError={onAudioError}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {introIndex > 0 && (
            <button
              onClick={() => setIntroIndex(introIndex - 1)}
              className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            onClick={() => {
              if (introIndex < lessonVocab.length - 1) {
                setIntroIndex(introIndex + 1);
                const nextWord = lessonVocab[introIndex + 1];
                playAudio(nextWord.hanzi, onAudioError);
              } else {
                goToNextStep();
              }
            }}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {introIndex < lessonVocab.length - 1 ? (
              <>Next <ChevronRight className="w-4 h-4" /></>
            ) : (
              <>Start Practice <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── Multiple Choice Step ───
  if (currentStep.type === "mc") {
    return (
      <div className="max-w-md mx-auto py-6 px-4 animate-fade-in">
        {topBar}
        <MultipleChoiceQuiz
          key={`mc-${quizKey}`}
          vocabulary={lessonVocab}
          direction={currentStep.direction}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onNext={goToNextStep}
          onAudioError={onAudioError}
        />
      </div>
    );
  }

  // ─── Matching Pairs Step ───
  if (currentStep.type === "matching") {
    return (
      <div className="max-w-md mx-auto py-6 px-4 animate-fade-in">
        {topBar}
        <MatchingPairsQuiz
          key={`match-${quizKey}`}
          vocabulary={lessonVocab}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          onNext={goToNextStep}
        />
      </div>
    );
  }

  // ─── Sentence Arrange Step ───
  if (currentStep.type === "sentence") {
    return (
      <div className="max-w-md mx-auto py-6 px-4 animate-fade-in">
        {topBar}
        <div className="text-center mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Arrange the sentence
          </p>
        </div>
        <SentenceDuel
          key={`sentence-${quizKey}`}
          mode="lesson"
          lessonVocabulary={lessonVocab}
          onXPEarned={(xp) => setXpEarned((prev) => prev + xp)}
          onDuelComplete={(won) => {
            if (!won) setHearts((h) => Math.max(0, h - 1));
            // Advance immediately as user clicked Next
            goToNextStep();
          }}
          streak={0}
          onAudioError={onAudioError}
        />
      </div>
    );
  }

  // ─── Victory Step ───
  if (currentStep.type === "victory") {
    const finalXP = xpEarned + 50; // Bonus for completing lesson

    return (
      <VictoryScreen
        lessonName={lesson.name}
        xpEarned={finalXP}
        hearts={hearts}
        wordCount={lessonVocab.length}
        onComplete={() => onComplete(finalXP)}
      />
    );
  }

  return null;
}

// Sub-components

interface VictoryScreenProps {
  lessonName: string;
  xpEarned: number;
  hearts: number;
  wordCount: number;
  onComplete: () => void;
}

function VictoryScreen({ lessonName, xpEarned, hearts, wordCount, onComplete }: VictoryScreenProps) {
  // Fire confetti once on mount
  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center animate-fade-in">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-success/15 flex items-center justify-center mx-auto">
          <Sparkles className="w-12 h-12 text-success" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mb-2">Lesson Complete!</h2>
      <p className="text-muted-foreground mb-8">
        You've mastered the words in "{lessonName}"
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-success">{xpEarned}</p>
          <p className="text-xs text-muted-foreground">XP Earned</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-destructive flex items-center justify-center gap-1">
            <Heart className="w-5 h-5" fill="currentColor" /> {hearts}
          </p>
          <p className="text-xs text-muted-foreground">Hearts Left</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-primary">{wordCount}</p>
          <p className="text-xs text-muted-foreground">Words</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
      >
        Continue
      </button>
    </div>
  );
}


