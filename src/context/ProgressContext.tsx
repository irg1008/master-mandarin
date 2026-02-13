import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type ProgressState,
  loadProgress,
  saveProgress,
  addXP as engineAddXP,
  updateStreak as engineUpdateStreak,
  unlockCard as engineUnlockCard,
  completeLesson as engineCompleteLesson,
} from "@/engine/xp";

interface ProgressContextType {
  progress: ProgressState;
  addXP: (amount: number) => void;
  updateStreak: (callback?: (state: ProgressState) => ProgressState) => void;
  unlockCard: (id: string) => void;
  completeLesson: (lessonId: string, newWords: string[]) => void;
  reloadProgress: () => void; // Useful for import/sync
  importProgressState: (state: ProgressState) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  // Initial load / sync
  useEffect(() => {
    // Initial streak check
    setProgress((prev) => {
      const updated = engineUpdateStreak(prev);
      saveProgress(updated);
      return updated;
    });
  }, []);

  const addXP = (amount: number) => {
    setProgress((prev) => {
      const updated = engineAddXP(prev, amount);
      saveProgress(updated);
      return updated;
    });
  };

  const updateStreak = (callback?: (state: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      let updated = engineUpdateStreak(prev);
      if (callback) {
        updated = callback(updated);
      }
      saveProgress(updated);
      return updated;
    });
  };

  const unlockCard = (id: string) => {
    setProgress((prev) => {
      const updated = engineUnlockCard(prev, id);
      saveProgress(updated);
      return updated;
    });
  };

  const completeLesson = (lessonId: string, newWords: string[]) => {
    setProgress((prev) => {
      const updated = engineCompleteLesson(prev, lessonId, newWords);
      saveProgress(updated);
      return updated;
    });
  };

  const reloadProgress = () => {
    setProgress(loadProgress());
  };

  const importProgressState = (state: ProgressState) => {
    setProgress(state);
    saveProgress(state);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        addXP,
        updateStreak,
        unlockCard,
        completeLesson,
        reloadProgress,
        importProgressState,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
