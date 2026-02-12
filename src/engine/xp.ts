export interface ProgressState {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastPlayed: string | null;
  unlockedCards: string[];
  completedQuests: string[];
  weekProgress: Record<number, number>; // week -> completion %
  totalDuelsWon: number;
  totalDuelsPlayed: number;
}

const STORAGE_KEY = "mandarin-master-progress";

const DEFAULT_STATE: ProgressState = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastPlayed: null,
  unlockedCards: [],
  completedQuests: [],
  weekProgress: {},
  totalDuelsWon: 0,
  totalDuelsPlayed: 0,
};

export function loadProgress(): ProgressState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  } catch {
    console.warn("Failed to load progress from localStorage");
  }
  return { ...DEFAULT_STATE };
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("Failed to save progress to localStorage");
  }
}

export function getXPForLevel(level: number): number {
  return level * 100 + (level - 1) * 50;
}

export function addXP(state: ProgressState, amount: number): ProgressState {
  let newXP = state.xp + amount;
  let newLevel = state.level;

  while (newXP >= getXPForLevel(newLevel)) {
    newXP -= getXPForLevel(newLevel);
    newLevel++;
  }

  const updated = { ...state, xp: newXP, level: newLevel };
  saveProgress(updated);
  return updated;
}

export function updateStreak(state: ProgressState): ProgressState {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = state.streak;
  if (state.lastPlayed === today) {
    return state; // Already played today
  } else if (state.lastPlayed === yesterday) {
    newStreak = state.streak + 1;
  } else {
    newStreak = 1; // Streak broken
  }

  const updated = {
    ...state,
    streak: newStreak,
    longestStreak: Math.max(newStreak, state.longestStreak),
    lastPlayed: today,
  };
  saveProgress(updated);
  return updated;
}

export function unlockCard(state: ProgressState, cardId: string): ProgressState {
  if (state.unlockedCards.includes(cardId)) return state;
  const updated = {
    ...state,
    unlockedCards: [...state.unlockedCards, cardId],
  };
  saveProgress(updated);
  return updated;
}

export function completeQuest(state: ProgressState, questId: string): ProgressState {
  if (state.completedQuests.includes(questId)) return state;
  const updated = {
    ...state,
    completedQuests: [...state.completedQuests, questId],
  };
  saveProgress(updated);
  return updated;
}

// ── Export / Import / Share ──

export function exportProgress(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}

export function importProgress(json: string): ProgressState | null {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed.xp === "number" && typeof parsed.level === "number") {
      const state = { ...DEFAULT_STATE, ...parsed };
      saveProgress(state);
      return state;
    }
  } catch {
    // Invalid JSON
  }
  return null;
}

export function generateShareSummary(state: ProgressState): string {
  const lines = [
    `🀄 Mandarin Master — Progress Summary`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `🏯 Level ${state.level} Duelist`,
    `⚡ ${state.xp} XP`,
    `🔥 ${state.streak}-day streak (Best: ${state.longestStreak})`,
    ``,
    `📜 Cards Mastered: ${state.unlockedCards.length}`,
    `⚔️ Duels Won: ${state.totalDuelsWon} / ${state.totalDuelsPlayed}`,
    `📈 Win Rate: ${state.totalDuelsPlayed > 0 ? Math.round((state.totalDuelsWon / state.totalDuelsPlayed) * 100) : 0}%`,
    ``,
    `🗓️ Last active: ${state.lastPlayed || "Never"}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Play at: Mandarin Master: Linguistic Duelist`,
  ];
  return lines.join("\n");
}

export function downloadProgress(state: ProgressState): void {
  const json = exportProgress(state);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mandarin-master-progress-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyShareSummary(state: ProgressState): Promise<void> {
  const summary = generateShareSummary(state);
  return navigator.clipboard.writeText(summary);
}
