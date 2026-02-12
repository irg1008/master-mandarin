import { useState, useEffect, useRef, useCallback } from "react";
import { Swords, Library, BookOpen, Volume2, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HeaderBar } from "@/components/HeaderBar";
import { SentenceDuel } from "@/components/SentenceDuel";
import { CurriculumView } from "@/components/CurriculumView";
import { VocabularyCard } from "@/components/VocabularyCard";
import { HSK1_VOCABULARY } from "@/data/hsk1-vocabulary";
import { playAudio } from "@/engine/audio";
import {
  loadProgress,
  addXP,
  updateStreak,
  unlockCard,
  downloadProgress,
  importProgress,
  copyShareSummary,
  type ProgressState,
} from "@/engine/xp";

export function MandarinMaster() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Apply dark mode on initial mount
    document.documentElement.classList.add("dark");
    setProgress((prev) => updateStreak(prev));
  }, []);

  const handleAudioError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const handleXPEarned = useCallback((xp: number) => {
    setProgress((prev) => addXP(prev, xp));
  }, []);

  const handleDuelComplete = useCallback((won: boolean) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        totalDuelsPlayed: prev.totalDuelsPlayed + 1,
        totalDuelsWon: won ? prev.totalDuelsWon + 1 : prev.totalDuelsWon,
      };
      if (won) return updateStreak(updated);
      return updated;
    });
  }, []);

  const handleExport = useCallback(() => {
    downloadProgress(progress);
  }, [progress]);

  const handleImport = useCallback(() => {
    setShowImportDialog(true);
    setImportText("");
    setImportError(null);
  }, []);

  const handleImportSubmit = useCallback(() => {
    const result = importProgress(importText);
    if (result) {
      setProgress(result);
      setShowImportDialog(false);
      setImportText("");
      setImportError(null);
    } else {
      setImportError("Invalid progress data. Please check the JSON format.");
    }
  }, [importText]);

  const handleFileImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setImportText(text);
    };
    reader.readAsText(file);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await copyShareSummary(progress);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch {
      setErrorMessage("Could not copy to clipboard. Please try again.");
    }
  }, [progress]);

  const handleToggleMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const handleCardUnlock = useCallback((hanzi: string) => {
    setProgress((prev) => unlockCard(prev, hanzi));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, color-mix(in oklch, var(--primary) 5%, transparent) 0%, transparent 40%, color-mix(in oklch, var(--secondary) 3%, transparent) 100%)`,
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "800px",
            height: "400px",
            background: `radial-gradient(ellipse, color-mix(in oklch, var(--primary) 6%, transparent) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <HeaderBar
          progress={progress}
          isDarkMode={isDarkMode}
          onToggleMode={handleToggleMode}
          onExport={handleExport}
          onImport={handleImport}
          onShare={handleShare}
        />

        {/* Share Toast */}
        {shareSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right px-5 py-3 rounded-xl shadow-xl text-sm font-semibold bg-success text-success-foreground">
            ✓ Summary copied to clipboard!
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-4 md:px-6 md:py-8 pb-20 md:pb-8">
          <Tabs defaultValue="duel">
            <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
              <TabsList className="w-full sm:w-auto min-w-max mb-2">
                <TabsTrigger value="duel" className="gap-2 flex-1 sm:flex-none">
                  <Swords className="w-4 h-4" />
                  <span>Duel</span>
                </TabsTrigger>
                <TabsTrigger value="collection" className="gap-2 flex-1 sm:flex-none">
                  <Library className="w-4 h-4" />
                  <span>Collection</span>
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="gap-2 flex-1 sm:flex-none">
                  <BookOpen className="w-4 h-4" />
                  <span>Curriculum</span>
                </TabsTrigger>
                <TabsTrigger value="phonetics" className="gap-2 flex-1 sm:flex-none">
                  <Volume2 className="w-4 h-4" />
                  <span>Phonetics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Duel Tab ── */}
            <TabsContent value="duel">
              <SentenceDuel
                onXPEarned={handleXPEarned}
                onDuelComplete={handleDuelComplete}
                streak={progress.streak}
                onAudioError={handleAudioError}
              />
            </TabsContent>

            {/* ── Collection Tab ── */}
            <TabsContent value="collection">
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
                          <div key={entry.hanzi} onClick={() => handleCardUnlock(entry.hanzi)} className="flex justify-center">
                            <VocabularyCard
                              entry={entry}
                              isUnlocked={progress.unlockedCards.includes(entry.hanzi)}
                              onAudioError={handleAudioError}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ── Curriculum Tab ── */}
            <TabsContent value="curriculum">
              <CurriculumView
                unlockedCards={progress.unlockedCards}
                onAudioError={handleAudioError}
              />
            </TabsContent>

            {/* ── Phonetics Tab ── */}
            <TabsContent value="phonetics">
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
                        onAudioError={handleAudioError}
                        onClick={() => playAudio(entry.hanzi, handleAudioError)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* ── Error Dialog ── */}
      <Dialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-secondary" />
              Audio Error
            </DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <button
            onClick={() => setErrorMessage(null)}
            className="w-full mt-4 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold transition-all cursor-pointer hover:opacity-90"
          >
            Dismiss
          </button>
        </DialogContent>
      </Dialog>

      {/* ── Import Dialog ── */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Progress</DialogTitle>
            <DialogDescription>
              Paste your progress JSON or load a file to restore your saved state.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <label
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl cursor-pointer border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-secondary transition-colors"
              htmlFor="import-file"
            >
              <span className="text-sm">Click to select a .json file</span>
              <input
                ref={fileInputRef}
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            <div className="text-center text-xs text-muted-foreground">— or paste JSON —</div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-xl text-sm font-mono resize-none bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder='{"xp": 0, "level": 1, ...}'
            />

            {importError && (
              <p className="text-sm flex items-center gap-1 text-destructive">
                <AlertTriangle className="w-3.5 h-3.5" />
                {importError}
              </p>
            )}

            <button
              onClick={handleImportSubmit}
              disabled={!importText.trim()}
              className="w-full px-4 py-3 rounded-xl font-semibold transition-all cursor-pointer bg-secondary text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              Import Progress
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
