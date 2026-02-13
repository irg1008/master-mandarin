import { BookOpen } from "lucide-react";
import type { GrammarPoint } from "@/data/hsk1-vocabulary";

interface TheorySlideProps {
  point: GrammarPoint;
  onNext: () => void;
}

export function TheorySlide({ point, onNext }: TheorySlideProps) {
  return (
    <div className="max-w-md mx-auto py-6 px-4 animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Grammar Tip</h2>
        <p className="text-muted-foreground">Master this rule to level up!</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-foreground mb-2">{point.english}</h3>
        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <p className="font-mono text-center text-lg font-bold text-primary">
            {point.pattern}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Example
            </p>
            <p className="text-xl font-chinese font-medium mb-1">{point.example}</p>
            <p className="text-sm text-foreground/80">{point.examplePinyin}</p>
            <p className="text-sm text-muted-foreground italic">{point.exampleEnglish}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Got it!
      </button>
    </div>
  );
}
