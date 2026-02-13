import type { VocabEntry } from "@/data/hsk1-vocabulary";

export interface QuestCard {
	id: string;
	english: string;
	targetOrder: VocabEntry[];
	shuffledCards: VocabEntry[];
	difficulty: "easy" | "medium" | "hard";
	xpReward: number;
}

// Sentence templates for SAVO (Subject-Adverb-Verb-Object) patterns
interface SentenceTemplate {
	english: string;
	roles: ("subject" | "adverb" | "verb" | "object" | "particle")[];
	hanziKeys: string[];
	difficulty: "easy" | "medium" | "hard";
}

const SENTENCE_TEMPLATES: SentenceTemplate[] = [
	// Single-word (for early lessons with very limited vocab)
	{
		english: "I / me",
		roles: ["subject"],
		hanziKeys: ["我"],
		difficulty: "easy",
	},
	{ english: "you", roles: ["subject"], hanziKeys: ["你"], difficulty: "easy" },
	{
		english: "he / him",
		roles: ["subject"],
		hanziKeys: ["他"],
		difficulty: "easy",
	},
	{
		english: "she / her",
		roles: ["subject"],
		hanziKeys: ["她"],
		difficulty: "easy",
	},
	{
		english: "good",
		roles: ["subject"],
		hanziKeys: ["好"],
		difficulty: "easy",
	},
	{
		english: "to be",
		roles: ["subject"],
		hanziKeys: ["是"],
		difficulty: "easy",
	},
	{
		english: "not / no",
		roles: ["subject"],
		hanziKeys: ["不"],
		difficulty: "easy",
	},
	{ english: "one", roles: ["subject"], hanziKeys: ["一"], difficulty: "easy" },
	{ english: "two", roles: ["subject"], hanziKeys: ["二"], difficulty: "easy" },
	{
		english: "three",
		roles: ["subject"],
		hanziKeys: ["三"],
		difficulty: "easy",
	},
	{
		english: "very",
		roles: ["subject"],
		hanziKeys: ["很"],
		difficulty: "easy",
	},
	{
		english: "also",
		roles: ["subject"],
		hanziKeys: ["也"],
		difficulty: "easy",
	},
	{
		english: "person",
		roles: ["subject"],
		hanziKeys: ["人"],
		difficulty: "easy",
	},
	{
		english: "water",
		roles: ["subject"],
		hanziKeys: ["水"],
		difficulty: "easy",
	},
	{ english: "tea", roles: ["subject"], hanziKeys: ["茶"], difficulty: "easy" },

	// Two-word (basic pairs)
	{
		english: "I am good.",
		roles: ["subject", "verb"],
		hanziKeys: ["我", "好"],
		difficulty: "easy",
	},
	{
		english: "Not good.",
		roles: ["adverb", "verb"],
		hanziKeys: ["不", "好"],
		difficulty: "easy",
	},
	{
		english: "She is good.",
		roles: ["subject", "verb"],
		hanziKeys: ["她", "好"],
		difficulty: "easy",
	},
	{
		english: "He is good.",
		roles: ["subject", "verb"],
		hanziKeys: ["他", "好"],
		difficulty: "easy",
	},

	// Easy — 2-3 cards
	{
		english: "I drink water.",
		roles: ["subject", "verb", "object"],
		hanziKeys: ["我", "喝", "水"],
		difficulty: "easy",
	},
	{
		english: "You are good.",
		roles: ["subject", "adverb", "verb"],
		hanziKeys: ["你", "很", "好"],
		difficulty: "easy",
	},
	{
		english: "He reads books.",
		roles: ["subject", "verb", "object"],
		hanziKeys: ["他", "看", "书"],
		difficulty: "easy",
	},
	{
		english: "She eats rice.",
		roles: ["subject", "verb", "object"],
		hanziKeys: ["她", "吃", "饭"],
		difficulty: "easy",
	},
	{
		english: "I want to go.",
		roles: ["subject", "verb", "verb"],
		hanziKeys: ["我", "想", "去"],
		difficulty: "easy",
	},
	{
		english: "He is a student.",
		roles: ["subject", "verb", "object"],
		hanziKeys: ["他", "是", "学生"],
		difficulty: "easy",
	},
	{
		english: "I study Chinese.",
		roles: ["subject", "verb", "object"],
		hanziKeys: ["我", "学", "中文"],
		difficulty: "easy",
	},
	{
		english: "She likes cats.",
		roles: ["subject", "verb", "object"],
		hanziKeys: ["她", "喜欢", "猫"],
		difficulty: "easy",
	},

	// Medium — 3-4 cards
	{
		english: "I don't drink tea.",
		roles: ["subject", "adverb", "verb", "object"],
		hanziKeys: ["我", "不", "喝", "茶"],
		difficulty: "medium",
	},
	{
		english: "Do you like China?",
		roles: ["subject", "verb", "object", "particle"],
		hanziKeys: ["你", "喜欢", "中国", "吗"],
		difficulty: "medium",
	},
	{
		english: "She is very beautiful.",
		roles: ["subject", "adverb", "adverb", "verb"],
		hanziKeys: ["她", "非常", "漂亮"],
		difficulty: "medium",
	},
	{
		english: "We eat Chinese food.",
		roles: ["subject", "verb", "object"],
		hanziKeys: ["我们", "吃", "中国菜"],
		difficulty: "medium",
	},
	{
		english: "He doesn't go to school.",
		roles: ["subject", "adverb", "verb", "object"],
		hanziKeys: ["他", "不", "去", "学校"],
		difficulty: "medium",
	},
	{
		english: "I want to drink coffee.",
		roles: ["subject", "verb", "verb", "object"],
		hanziKeys: ["我", "想", "喝", "咖啡"],
		difficulty: "medium",
	},

	// Hard — 4-5 cards
	{
		english: "I also want to go to China.",
		roles: ["subject", "adverb", "verb", "verb", "object"],
		hanziKeys: ["我", "也", "想", "去", "中国"],
		difficulty: "hard",
	},
	{
		english: "She doesn't like to eat rice.",
		roles: ["subject", "adverb", "verb", "verb", "object"],
		hanziKeys: ["她", "不", "喜欢", "吃", "饭"],
		difficulty: "hard",
	},
];

function shuffleArray<T>(arr: T[]): T[] {
	const shuffled = [...arr];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export function generateQuest(
	vocabulary: VocabEntry[],
	difficulty?: "easy" | "medium" | "hard",
): QuestCard | null {
	const vocabMap = new Map(vocabulary.map((v) => [v.hanzi, v]));

	// Filter templates by difficulty if specified
	let templates = SENTENCE_TEMPLATES;
	if (difficulty) {
		templates = templates.filter((t) => t.difficulty === difficulty);
	}

	// Filter templates where all required characters are available
	const validTemplates = templates.filter((t) =>
		t.hanziKeys.every((k) => vocabMap.has(k)),
	);

	if (validTemplates.length === 0) return null;

	const template =
		validTemplates[Math.floor(Math.random() * validTemplates.length)];
	const targetOrder = template.hanziKeys
		.map((k) => vocabMap.get(k)!)
		.filter(Boolean);

	// ── Add distractor cards ──
	// Pick random vocab NOT in the answer to make it challenging
	const answerHanzi = new Set(template.hanziKeys);
	const possibleDistractors = vocabulary.filter(
		(v) => !answerHanzi.has(v.hanzi),
	);

	// Scale distractors: more for fewer answer cards, always enough to be challenging
	const numDistractors =
		targetOrder.length === 1
			? Math.min(5, possibleDistractors.length)
			: targetOrder.length <= 3
				? Math.min(4, possibleDistractors.length)
				: Math.min(3, possibleDistractors.length);

	const distractors = shuffleArray(possibleDistractors).slice(
		0,
		numDistractors,
	);
	const allCards = shuffleArray([...targetOrder, ...distractors]);

	const xpMap = { easy: 10, medium: 25, hard: 50 };

	return {
		id: `quest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		english: template.english,
		targetOrder,
		shuffledCards: allCards,
		difficulty: template.difficulty,
		xpReward: xpMap[template.difficulty],
	};
}

export function checkAnswer(
	quest: QuestCard,
	placedCards: VocabEntry[],
): boolean {
	if (placedCards.length !== quest.targetOrder.length) return false;
	return quest.targetOrder.every(
		(card, i) => card.hanzi === placedCards[i].hanzi,
	);
}

export function getXPForStreak(baseXP: number, streak: number): number {
	const streakBonus = Math.min(streak, 10) * 0.1; // Max 100% bonus at 10-streak
	return Math.round(baseXP * (1 + streakBonus));
}
