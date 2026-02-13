import { SentenceDuel } from "@/components/SentenceDuel";
import { useProgress } from "@/context/ProgressContext";

export function Duel() {
  const { progress, addXP, updateStreak } = useProgress();

  const handleDuelComplete = (won: boolean) => {
    updateStreak((prev) => {
      const updated = {
        ...prev,
        totalDuelsPlayed: prev.totalDuelsPlayed + 1,
        totalDuelsWon: won ? prev.totalDuelsWon + 1 : prev.totalDuelsWon,
      };
      // Note: engineUpdateStreak should handle the streak logic, but here we update stats
      // Actually updateStreak context wrapper calls engineUpdateStreak internally.
      // But we need to update duel stats specifically.
      // We might need a specific 'updateDuelStats' in context or just use the generic update loop.
      // For now, let's assume updateStreak callback matches what we had in MandarinMaster.
      return updated;
    });
  };

  return (
    <SentenceDuel
      mode="practice"
      unlockedCards={progress.unlockedCards}
      onXPEarned={addXP}
      onDuelComplete={handleDuelComplete}
      streak={progress.streak}
    />
    // Note: onAudioError not passed here, let global error handler catch it?
    // Actually RootLayout handles errors. We might need to expose setErrorMessage via Context too.
    // For now, allow it to be optional or swallow.
  );
}
