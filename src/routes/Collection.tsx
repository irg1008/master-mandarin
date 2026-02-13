import { Library } from "lucide-react";
import { VocabularyCard } from "@/components/VocabularyCard";
import { HSK1_VOCABULARY } from "@/data/hsk1-vocabulary";
import { useProgress } from "@/context/ProgressContext";
import { playAudio } from "@/engine/audio";

export function Collection() {
  const { progress } = useProgress();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl shadow-lg"
          style={{ background: `linear-gradient(135deg, var(--card-noun), var(--card-noun-dark))` }}
        >
          <Library className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Card Collection</h2>
          <p className="text-sm text-muted-foreground">
            {progress.unlockedCards.length} / {HSK1_VOCABULARY.length} cards mastered
          </p>
        </div>
      </div>

      {(["noun", "verb", "adjective", "particle"] as const).map((type) => {
        const cards = HSK1_VOCABULARY.filter((v) => v.type === type);
        const labels = {
          noun: "📘 Nouns",
          verb: "📕 Verbs",
          adjective: "📗 Adjectives",
          particle: "📙 Particles",
        };
        return (
          <div key={type} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {labels[type]} · {cards.length}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
              {cards.map((entry) => (
                <div key={entry.hanzi} className="flex justify-center">
                  {/* unlockedCards check needs to support both ID and Hanzi (legacy) */}
                  <VocabularyCard
                    entry={entry}
                    isUnlocked={progress.unlockedCards.includes(entry.id) || progress.unlockedCards.includes(entry.hanzi)}
                    onAudioError={(msg) => console.error(msg)} // Simple log for now
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
