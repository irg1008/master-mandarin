import { BookOpen, Scroll, GraduationCap } from "lucide-react";
import {
  ROADMAP_PHASES,
  GRAMMAR_POINTS,
  TONE_CHART,
  RADICAL_MAP,
  getVocabularyByPhase,
} from "@/data/hsk1-vocabulary";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { VocabularyCard } from "./VocabularyCard";

interface CurriculumViewProps {
  unlockedCards: string[];
  onAudioError?: (message: string) => void;
}

export function CurriculumView({ unlockedCards, onAudioError }: CurriculumViewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Roadmap */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-xl"
            style={{ background: `linear-gradient(135deg, var(--secondary), var(--secondary-dark))` }}
          >
            <BookOpen className="w-6 h-6 text-secondary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">24-Week Roadmap</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {ROADMAP_PHASES.map((phase, i) => {
            const phaseVocab = getVocabularyByPhase(phase);
            const unlockedCount = phaseVocab.filter((v) => unlockedCards.includes(v.hanzi)).length;

            return (
              <AccordionItem key={phase.name} value={`phase-${i}`} className="glass-card border-none px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: phase.color }}
                    />
                    <div className="text-left">
                      <div className="font-bold text-foreground">
                        Phase {i + 1}: {phase.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Weeks {phase.weeks[0]}-{phase.weeks[phase.weeks.length - 1]} · {phaseVocab.length} words · {unlockedCount} mastered
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {phaseVocab.map((entry) => (
                        <VocabularyCard
                          key={entry.hanzi}
                          entry={entry}
                          compact
                          isUnlocked={unlockedCards.includes(entry.hanzi)}
                          onAudioError={onAudioError}
                        />
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Grammar Points */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-xl"
            style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}
          >
            <Scroll className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Grammar Patterns</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {GRAMMAR_POINTS.map((gp) => (
            <div key={gp.id} className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono px-2 py-0.5 rounded text-secondary bg-secondary/10">
                  {gp.pattern}
                </code>
                <span className="text-xs text-muted-foreground">W{gp.week}</span>
              </div>
              <p className="text-sm text-muted-foreground">{gp.english}</p>
              <div className="pt-1 border-t border-border">
                <p className="font-chinese text-lg text-foreground">{gp.example}</p>
                <p className="text-xs text-muted-foreground">
                  {gp.examplePinyin} — {gp.exampleEnglish}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tone Chart */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-xl"
            style={{ background: `linear-gradient(135deg, var(--card-noun), var(--card-noun-dark))` }}
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">5-Tone System</h2>
        </div>

        <div className="grid gap-3">
          {TONE_CHART.map((tone) => (
            <div key={tone.tone} className="glass-card p-4 flex items-start gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 shadow-lg"
                style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}
              >
                <span className="text-xl font-bold text-primary-foreground">{tone.tone}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-foreground">{tone.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                    {tone.pitch}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{tone.description}</p>
                <p className="text-sm font-chinese text-secondary">{tone.example}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Radical Reference */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-xl"
            style={{ background: `linear-gradient(135deg, var(--card-particle), var(--card-particle-dark))` }}
          >
            <BookOpen className="w-6 h-6 text-secondary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Radical Reference</h2>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Object.entries(RADICAL_MAP).map(([radical, meaning]) => (
              <div
                key={radical}
                className="flex items-center gap-3 p-3 border-r border-b border-border"
              >
                <span className="font-chinese text-2xl text-secondary">{radical}</span>
                <span className="text-xs text-muted-foreground">{meaning as string}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
