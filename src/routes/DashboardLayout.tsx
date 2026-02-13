import { useState, useMemo, useEffect, useCallback } from "react";
import { Outlet, Link } from "@tanstack/react-router";
import { HeaderBar } from "@/components/HeaderBar";
import { StreakBanner } from "@/components/StreakBanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle, Map, Swords, Library, BookOpen, Pencil, Volume2 } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { downloadProgress, importProgress, copyShareSummary } from "@/engine/xp";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export function DashboardLayout() {
  const { progress, importProgressState } = useProgress();
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("mm-theme");
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
    return "system";
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [showStreakBanner, setShowStreakBanner] = useState(true);

  // Theme Logic
  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (themeMode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return themeMode;
  }, [themeMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    localStorage.setItem("mm-theme", themeMode);
  }, [themeMode, resolvedTheme]);

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
      importProgressState(result);
      setShowImportDialog(false);
      setImportText("");
      setImportError(null);
    } else {
      setImportError("Invalid progress data. Please check the JSON format.");
    }
  }, [importText, importProgressState]);

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
      toast.success("Summary copied to clipboard!", { duration: 1000000 });
    } catch {
      toast.error("Could not copy to clipboard. Please try again.");
    }
  }, [progress]);

  const navLinkClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[status=active]:bg-background data-[status=active]:text-foreground data-[status=active]:shadow text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-2 flex-1 sm:flex-none";

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
        <HeaderBar
          progress={progress}
          themeMode={themeMode}
          resolvedTheme={resolvedTheme}
          onSetTheme={setThemeMode}
          onExport={handleExport}
          onImport={handleImport}
          onShare={handleShare}
        />

        <main className="max-w-6xl mx-auto px-4 py-4 md:px-6 md:py-8 pb-20 md:pb-8">
          {showStreakBanner && progress.streak > 0 && (
            <div className="mb-6">
              <StreakBanner progress={progress} onDismiss={() => setShowStreakBanner(false)} />
            </div>
          )}

          {/* Navigation Tabs (Replica of TabsList using Links) */}
          <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 mb-4">
            <div className="inline-flex h-9 items-center justify-center rounded-lg p-1 text-muted-foreground bg-muted w-full sm:w-auto min-w-max">
              <Link to="/" className={navLinkClass} activeProps={{ "data-status": "active" }} activeOptions={{ exact: true }}>
                <Map className="w-4 h-4" />
                <span>Roadmap</span>
              </Link>
              <Link to="/duel" className={navLinkClass} activeProps={{ "data-status": "active" }}>
                <Swords className="w-4 h-4" />
                <span>Duel</span>
              </Link>
              <Link to="/collection" className={navLinkClass} activeProps={{ "data-status": "active" }}>
                <Library className="w-4 h-4" />
                <span>Collection</span>
              </Link>
              <Link to="/curriculum" className={navLinkClass} activeProps={{ "data-status": "active" }}>
                <BookOpen className="w-4 h-4" />
                <span>Curriculum</span>
              </Link>
              <Link to="/draw" className={navLinkClass} activeProps={{ "data-status": "active" }}>
                <Pencil className="w-4 h-4" />
                <span>Draw</span>
              </Link>
              <Link to="/phonetics" className={navLinkClass} activeProps={{ "data-status": "active" }}>
                <Volume2 className="w-4 h-4" />
                <span>Phonetics</span>
              </Link>
            </div>
          </div>

          <Outlet /> {/* Renders the child route */}
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
            >
              <span className="text-sm">Click to select a .json file</span>
              <input
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
      <Toaster />
    </div>
  );
}
