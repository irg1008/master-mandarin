import { Volume2 } from "lucide-react";
import { VocabularyCard } from "@/components/VocabularyCard";
import { HSK1_VOCABULARY } from "@/data/hsk1-vocabulary";
import { playAudio } from "@/engine/audio";

export function Phonetics() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl shadow-lg"
          style={{ background: `linear-gradient(135deg, var(--phonetics), var(--phonetics-dark))` }}
        >
          <Volume2 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Phonetics Lab</h2>
          <p className="text-sm text-muted-foreground">Master the 5-tone system</p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5 border border-border">
        <h3 className="text-lg font-bold text-foreground">Quick Practice</h3>
        <p className="text-sm text-muted-foreground">
          Click any card to hear its pronunciation — pay attention to the tone!
        </p>
        <div className="flex flex-wrap gap-4">
          {HSK1_VOCABULARY.slice(0, 20).map((entry) => (
            <VocabularyCard
              key={entry.hanzi}
              entry={entry}
              compact
              onAudioError={(msg) => console.error(msg)}
              onClick={() => playAudio(entry.hanzi, (msg) => console.error(msg))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
