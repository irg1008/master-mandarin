import { COURSE_CONTENT } from "@/data/hsk1-vocabulary";

export interface ProgressState {
	xp: number;
	level: number;
	streak: number;
	longestStreak: number;
	lastPlayed: string | null;
	unlockedCards: string[]; // IDs of unlocked cards
	completedQuests: string[];
	totalDuelsWon: number;
	totalDuelsPlayed: number;

	// Lesson Tracking
	currentUnitId: string;
	currentLessonId: string;
	completedLessons: string[];

	// Daily goal & streak enhancements
	dailyXPGoal: number;
	todayXP: number;
	todayDate: string; // YYYY-MM-DD
	streakFreezes: number;
	lastFreezeUsed: string | null;
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
	totalDuelsWon: 0,
	totalDuelsPlayed: 0,

	currentUnitId: "unit-1",
	currentLessonId: "lesson-1-1",
	completedLessons: [],

	dailyXPGoal: 50,
	todayXP: 0,
	todayDate: new Date().toISOString().split("T")[0],
	streakFreezes: 1,
	lastFreezeUsed: null,
};

export function loadProgress(): ProgressState {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			// Merge with default state to handle new fields
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
	const today = new Date().toISOString().split("T")[0];
	let newXP = state.xp + amount;
	let newLevel = state.level;

	while (newXP >= getXPForLevel(newLevel)) {
		newXP -= getXPForLevel(newLevel);
		newLevel++;
	}

	// Track daily XP
	const todayXP = (state.todayDate === today ? state.todayXP : 0) + amount;

	const updated = {
		...state,
		xp: newXP,
		level: newLevel,
		todayXP,
		todayDate: today,
	};
	saveProgress(updated);
	return updated;
}

export function getDailyProgress(state: ProgressState): {
	percentage: number;
	remaining: number;
	met: boolean;
} {
	const pct = Math.min(
		100,
		Math.round((state.todayXP / state.dailyXPGoal) * 100),
	);
	return {
		percentage: pct,
		remaining: Math.max(0, state.dailyXPGoal - state.todayXP),
		met: pct >= 100,
	};
}

export function updateStreak(state: ProgressState): ProgressState {
	const today = new Date().toISOString().split("T")[0];
	const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

	// Reset daily XP if it's a new day
	let todayXP = state.todayXP;
	if (state.todayDate !== today) {
		todayXP = 0;
	}

	let newStreak = state.streak;
	let freezes = state.streakFreezes;
	let lastFreezeUsed = state.lastFreezeUsed;

	if (state.lastPlayed === today) {
		// Already played today — just sync daily date
		const updated = { ...state, todayDate: today, todayXP };
		saveProgress(updated);
		return updated;
	} else if (state.lastPlayed === yesterday) {
		newStreak = state.streak + 1;
	} else if (state.lastPlayed) {
		// Missed more than 1 day — check streak freeze
		const daysBetween = Math.floor(
			(new Date(today).getTime() - new Date(state.lastPlayed).getTime()) /
				86400000,
		);
		if (daysBetween === 2 && freezes > 0) {
			// Use a streak freeze (forgives exactly 1 missed day)
			newStreak = state.streak + 1;
			freezes -= 1;
			lastFreezeUsed = today;
		} else {
			newStreak = 1; // Reset to 1 (they're playing today)
		}
	} else {
		newStreak = 1; // First time playing
	}

	const updated = {
		...state,
		streak: newStreak,
		longestStreak: Math.max(newStreak, state.longestStreak),
		lastPlayed: today,
		todayDate: today,
		todayXP,
		streakFreezes: freezes,
		lastFreezeUsed: lastFreezeUsed,
	};
	saveProgress(updated);
	return updated;
}

export function unlockCard(
	state: ProgressState,
	cardId: string,
): ProgressState {
	if (state.unlockedCards.includes(cardId)) return state;
	const updated = {
		...state,
		unlockedCards: [...state.unlockedCards, cardId],
	};
	saveProgress(updated);
	return updated;
}

export function completeLesson(
	state: ProgressState,
	lessonId: string,
	newUnlockedIds: string[],
): ProgressState {
	if (state.completedLessons.includes(lessonId)) return state;

	const completedLessons = [...state.completedLessons, lessonId];

	// Determine next lesson
	let nextLessonId = state.currentLessonId;
	let nextUnitId = state.currentUnitId;

	// Find current position
	let found = false;
	for (const unit of COURSE_CONTENT) {
		if (found) break;
		for (let i = 0; i < unit.lessons.length; i++) {
			if (unit.lessons[i].id === lessonId) {
				// Found completed lesson, what's next?
				if (i < unit.lessons.length - 1) {
					// Next lesson in same unit
					nextLessonId = unit.lessons[i + 1].id;
				} else {
					// Next unit?
					const unitIndex = COURSE_CONTENT.findIndex((u) => u.id === unit.id);
					if (unitIndex < COURSE_CONTENT.length - 1) {
						nextUnitId = COURSE_CONTENT[unitIndex + 1].id;
						nextLessonId = COURSE_CONTENT[unitIndex + 1].lessons[0].id;
					}
				}
				found = true;
				break;
			}
		}
	}

	const updated = {
		...state,
		completedLessons,
		currentUnitId: nextUnitId,
		currentLessonId: nextLessonId,
		unlockedCards: [...new Set([...state.unlockedCards, ...newUnlockedIds])],
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
		`🔥 ${state.streak}-day streak`,
		``,
		`📜 Cards Mastered: ${state.unlockedCards.length}`,
		`🎓 Lessons Completed: ${state.completedLessons.length}`,
		``,
		`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
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
