export interface VocabEntry {
	id: string; // Unique ID to prevent key collisions
	hanzi: string;
	pinyin: string;
	english: string;
	type: "noun" | "verb" | "adjective" | "particle";
	radical?: string;
	radicalMeaning?: string;
	toneNumber: 1 | 2 | 3 | 4 | 5;
	week: number; // Keeping for reference, but mapping to units below
}

export interface Lesson {
	id: string;
	name: string;
	description: string;
	newWords: string[]; // IDs of VocabEntries
	grammarPoints?: string[]; // IDs of GrammarPoints
}

export interface Unit {
	id: string;
	name: string;
	description: string;
	lessons: Lesson[];
	color: string;
}

export interface GrammarPoint {
	id: string;
	pattern: string;
	english: string;
	example: string;
	examplePinyin: string;
	exampleEnglish: string;
	week: number;
}

export interface RoadmapPhase {
	name: string;
	weeks: number[];
	description: string;
	color: string;
}

// ── 24-Week Roadmap (Legacy / Reference) ──
export const ROADMAP_PHASES: RoadmapPhase[] = [
	{
		name: "Foundations",
		weeks: [1, 2, 3, 4],
		description: "Pinyin, tones, basic greetings, numbers 1-10",
		color: "#C41E3A",
	},
	{
		name: "Identity",
		weeks: [5, 6, 7, 8],
		description: "Self-introduction, family, nationality, age",
		color: "#E63950",
	},
	{
		name: "Survival",
		weeks: [9, 10, 11, 12],
		description: "Food, drink, shopping, directions",
		color: "#D4AF37",
	},
	{
		name: "Time & Place",
		weeks: [13, 14, 15, 16],
		description: "Days, months, locations, transportation",
		color: "#E5C85C",
	},
	{
		name: "Description",
		weeks: [17, 18, 19, 20],
		description: "Colors, sizes, weather, feelings",
		color: "#3B82F6",
	},
	{
		name: "Integration",
		weeks: [21, 22, 23, 24],
		description: "Complex sentences, storytelling, review",
		color: "#22C55E",
	},
];

// ── Radical-Semantic Mapping ──
export const RADICAL_MAP: Record<string, string> = {
	氵: "water",
	亻: "person",
	口: "mouth",
	女: "woman",
	木: "wood/tree",
	日: "sun/day",
	月: "moon/month",
	心: "heart",
	忄: "heart (left)",
	手: "hand",
	扌: "hand (left)",
	火: "fire",
	灬: "fire (bottom)",
	土: "earth",
	金: "metal/gold",
	钅: "metal (left)",
	食: "food",
	饣: "food (left)",
	言: "speech",
	讠: "speech (left)",
	走: "walk",
	足: "foot",
	目: "eye",
	耳: "ear",
	门: "door",
	草: "grass",
	艹: "grass (top)",
	雨: "rain",
	山: "mountain",
	石: "stone",
	田: "field",
	力: "power",
	刀: "knife",
	大: "big",
	小: "small",
};

// ── HSK 3.0 Level 1 Vocabulary ──
export const HSK1_VOCABULARY: VocabEntry[] = [
	// Week 1-4: Foundations
	{
		id: "v1",
		hanzi: "我",
		pinyin: "wǒ",
		english: "I, me",
		type: "noun",
		toneNumber: 3,
		week: 1,
	},
	{
		id: "v2",
		hanzi: "你",
		pinyin: "nǐ",
		english: "you",
		type: "noun",
		toneNumber: 3,
		week: 1,
	},
	{
		id: "v3",
		hanzi: "他",
		pinyin: "tā",
		english: "he, him",
		type: "noun",
		toneNumber: 1,
		week: 1,
	},
	{
		id: "v4",
		hanzi: "她",
		pinyin: "tā",
		english: "she, her",
		type: "noun",
		toneNumber: 1,
		week: 1,
	},
	{
		id: "v5",
		hanzi: "好",
		pinyin: "hǎo",
		english: "good",
		type: "adjective",
		toneNumber: 3,
		week: 1,
	},
	{
		id: "v6",
		hanzi: "是",
		pinyin: "shì",
		english: "to be",
		type: "verb",
		toneNumber: 4,
		week: 1,
	},
	{
		id: "v7",
		hanzi: "不",
		pinyin: "bù",
		english: "not, no",
		type: "particle",
		toneNumber: 4,
		week: 1,
	},
	{
		id: "v8",
		hanzi: "的",
		pinyin: "de",
		english: "possessive particle",
		type: "particle",
		toneNumber: 5,
		week: 1,
	},
	{
		id: "v9",
		hanzi: "一",
		pinyin: "yī",
		english: "one",
		type: "noun",
		toneNumber: 1,
		week: 2,
	},
	{
		id: "v10",
		hanzi: "二",
		pinyin: "èr",
		english: "two",
		type: "noun",
		toneNumber: 4,
		week: 2,
	},
	{
		id: "v11",
		hanzi: "三",
		pinyin: "sān",
		english: "three",
		type: "noun",
		toneNumber: 1,
		week: 2,
	},
	{
		id: "v12",
		hanzi: "四",
		pinyin: "sì",
		english: "four",
		type: "noun",
		toneNumber: 4,
		week: 2,
	},
	{
		id: "v13",
		hanzi: "五",
		pinyin: "wǔ",
		english: "five",
		type: "noun",
		toneNumber: 3,
		week: 2,
	},
	{
		id: "v14",
		hanzi: "很",
		pinyin: "hěn",
		english: "very",
		type: "particle",
		toneNumber: 3,
		week: 3,
	},
	{
		id: "v15",
		hanzi: "吗",
		pinyin: "ma",
		english: "question particle",
		type: "particle",
		toneNumber: 5,
		week: 3,
	},
	{
		id: "v16",
		hanzi: "了",
		pinyin: "le",
		english: "completed action",
		type: "particle",
		toneNumber: 5,
		week: 3,
	},
	{
		id: "v17",
		hanzi: "也",
		pinyin: "yě",
		english: "also",
		type: "particle",
		toneNumber: 3,
		week: 4,
	},
	{
		id: "v18",
		hanzi: "都",
		pinyin: "dōu",
		english: "all, both",
		type: "particle",
		toneNumber: 1,
		week: 4,
	},

	// Week 5-8: Identity
	{
		id: "v19",
		hanzi: "人",
		pinyin: "rén",
		english: "person",
		type: "noun",
		radical: "亻",
		radicalMeaning: "person",
		toneNumber: 2,
		week: 5,
	},
	{
		id: "v20",
		hanzi: "学生",
		pinyin: "xuéshēng",
		english: "student",
		type: "noun",
		toneNumber: 2,
		week: 5,
	},
	{
		id: "v21",
		hanzi: "老师",
		pinyin: "lǎoshī",
		english: "teacher",
		type: "noun",
		toneNumber: 3,
		week: 5,
	},
	{
		id: "v22",
		hanzi: "朋友",
		pinyin: "péngyǒu",
		english: "friend",
		type: "noun",
		toneNumber: 2,
		week: 6,
	},
	{
		id: "v23",
		hanzi: "家",
		pinyin: "jiā",
		english: "home, family",
		type: "noun",
		toneNumber: 1,
		week: 6,
	},
	{
		id: "v24",
		hanzi: "中国",
		pinyin: "Zhōngguó",
		english: "China",
		type: "noun",
		toneNumber: 1,
		week: 7,
	},
	{
		id: "v25",
		hanzi: "中文",
		pinyin: "Zhōngwén",
		english: "Chinese (language)",
		type: "noun",
		toneNumber: 1,
		week: 7,
	},
	{
		id: "v26",
		hanzi: "叫",
		pinyin: "jiào",
		english: "to be called",
		type: "verb",
		toneNumber: 4,
		week: 7,
	},
	{
		id: "v27",
		hanzi: "学",
		pinyin: "xué",
		english: "to study",
		type: "verb",
		radical: "子",
		radicalMeaning: "child",
		toneNumber: 2,
		week: 8,
	},
	{
		id: "v28",
		hanzi: "想",
		pinyin: "xiǎng",
		english: "to want, to think",
		type: "verb",
		radical: "心",
		radicalMeaning: "heart",
		toneNumber: 3,
		week: 8,
	},

	// Week 9-12: Survival
	{
		id: "v29",
		hanzi: "水",
		pinyin: "shuǐ",
		english: "water",
		type: "noun",
		radical: "氵",
		radicalMeaning: "water",
		toneNumber: 3,
		week: 9,
	},
	{
		id: "v30",
		hanzi: "茶",
		pinyin: "chá",
		english: "tea",
		type: "noun",
		radical: "艹",
		radicalMeaning: "grass",
		toneNumber: 2,
		week: 9,
	},
	{
		id: "v31",
		hanzi: "咖啡",
		pinyin: "kāfēi",
		english: "coffee",
		type: "noun",
		toneNumber: 1,
		week: 9,
	},
	{
		id: "v32",
		hanzi: "饭",
		pinyin: "fàn",
		english: "rice, meal",
		type: "noun",
		radical: "饣",
		radicalMeaning: "food",
		toneNumber: 4,
		week: 10,
	},
	{
		id: "v33",
		hanzi: "中国菜",
		pinyin: "Zhōngguó cài",
		english: "Chinese food",
		type: "noun",
		toneNumber: 1,
		week: 10,
	},
	{
		id: "v34",
		hanzi: "喝",
		pinyin: "hē",
		english: "to drink",
		type: "verb",
		radical: "口",
		radicalMeaning: "mouth",
		toneNumber: 1,
		week: 10,
	},
	{
		id: "v35",
		hanzi: "吃",
		pinyin: "chī",
		english: "to eat",
		type: "verb",
		radical: "口",
		radicalMeaning: "mouth",
		toneNumber: 1,
		week: 10,
	},
	{
		id: "v36",
		hanzi: "买",
		pinyin: "mǎi",
		english: "to buy",
		type: "verb",
		toneNumber: 3,
		week: 11,
	},
	{
		id: "v37",
		hanzi: "钱",
		pinyin: "qián",
		english: "money",
		type: "noun",
		radical: "钅",
		radicalMeaning: "metal",
		toneNumber: 2,
		week: 11,
	},
	{
		id: "v38",
		hanzi: "多少",
		pinyin: "duōshǎo",
		english: "how much / many",
		type: "particle",
		toneNumber: 1,
		week: 11,
	},

	// Week 13-16: Time & Place
	{
		id: "v39",
		hanzi: "今天",
		pinyin: "jīntiān",
		english: "today",
		type: "noun",
		toneNumber: 1,
		week: 13,
	},
	{
		id: "v40",
		hanzi: "明天",
		pinyin: "míngtiān",
		english: "tomorrow",
		type: "noun",
		toneNumber: 2,
		week: 13,
	},
	{
		id: "v41",
		hanzi: "昨天",
		pinyin: "zuótiān",
		english: "yesterday",
		type: "noun",
		toneNumber: 2,
		week: 13,
	},
	{
		id: "v42",
		hanzi: "去",
		pinyin: "qù",
		english: "to go",
		type: "verb",
		toneNumber: 4,
		week: 14,
	},
	{
		id: "v43",
		hanzi: "来",
		pinyin: "lái",
		english: "to come",
		type: "verb",
		toneNumber: 2,
		week: 14,
	},
	{
		id: "v44",
		hanzi: "学校",
		pinyin: "xuéxiào",
		english: "school",
		type: "noun",
		toneNumber: 2,
		week: 15,
	},
	{
		id: "v45",
		hanzi: "商店",
		pinyin: "shāngdiàn",
		english: "shop",
		type: "noun",
		toneNumber: 1,
		week: 15,
	},

	// Week 17-20: Description
	{
		id: "v46",
		hanzi: "大",
		pinyin: "dà",
		english: "big",
		type: "adjective",
		toneNumber: 4,
		week: 17,
	},
	{
		id: "v47",
		hanzi: "小",
		pinyin: "xiǎo",
		english: "small",
		type: "adjective",
		toneNumber: 3,
		week: 17,
	},
	{
		id: "v48",
		hanzi: "漂亮",
		pinyin: "piàoliang",
		english: "beautiful",
		type: "adjective",
		toneNumber: 4,
		week: 18,
	},
	{
		id: "v49",
		hanzi: "高兴",
		pinyin: "gāoxìng",
		english: "happy",
		type: "adjective",
		toneNumber: 1,
		week: 18,
	},
	{
		id: "v50",
		hanzi: "非常",
		pinyin: "fēicháng",
		english: "extremely",
		type: "particle",
		toneNumber: 1,
		week: 19,
	},

	// Week 21-24: Integration
	{
		id: "v51",
		hanzi: "看",
		pinyin: "kàn",
		english: "to look, to read",
		type: "verb",
		radical: "目",
		radicalMeaning: "eye",
		toneNumber: 4,
		week: 21,
	},
	{
		id: "v52",
		hanzi: "书",
		pinyin: "shū",
		english: "book",
		type: "noun",
		toneNumber: 1,
		week: 21,
	},
	{
		id: "v53",
		hanzi: "喜欢",
		pinyin: "xǐhuān",
		english: "to like",
		type: "verb",
		toneNumber: 3,
		week: 22,
	},
	{
		id: "v54",
		hanzi: "猫",
		pinyin: "māo",
		english: "cat",
		type: "noun",
		toneNumber: 1,
		week: 22,
	},
	{
		id: "v55",
		hanzi: "狗",
		pinyin: "gǒu",
		english: "dog",
		type: "noun",
		toneNumber: 3,
		week: 22,
	},
	{
		id: "v56",
		hanzi: "我们",
		pinyin: "wǒmen",
		english: "we, us",
		type: "noun",
		toneNumber: 3,
		week: 23,
	},
	{
		id: "v57",
		hanzi: "说",
		pinyin: "shuō",
		english: "to speak",
		type: "verb",
		radical: "讠",
		radicalMeaning: "speech",
		toneNumber: 1,
		week: 24,
	},
];

/**
 * Course Content Structure
 * Mapping the vocabulary into Units and Lessons for the Roadmap.
 */
export const COURSE_CONTENT: Unit[] = [
	{
		id: "unit-1",
		name: "Foundations",
		description: "Start here! Learn basic pronouns, greetings, and numbers.",
		color: "#C41E3A",
		lessons: [
			{
				id: "lesson-1-1",
				name: "Me & You",
				description: "Learn I, You, He, She",
				newWords: ["v1", "v2", "v3", "v4"],
				grammarPoints: ["g1"], // S 是 O
			},
			{
				id: "lesson-1-2",
				name: "Basic Verbs",
				description: "Good, To Be, Not",
				newWords: ["v5", "v6", "v7", "v8"],
				grammarPoints: ["g2"], // Negation
			},
			{
				id: "lesson-1-3",
				name: "Numbers 1-5",
				description: "Count from one to five",
				newWords: ["v9", "v10", "v11", "v12", "v13"],
			},
			{
				id: "lesson-1-4",
				name: "Common Particles",
				description: "Very, Question, Completed, Also, All",
				newWords: ["v14", "v15", "v16", "v17", "v18"],
				grammarPoints: ["g3", "g4"], // Ma question, Very + adj
			},
		],
	},
	{
		id: "unit-2",
		name: "Identity",
		description: "Introduce yourself and talk about your family.",
		color: "#E63950",
		lessons: [
			{
				id: "lesson-2-1",
				name: "People",
				description: "Person, Student, Teacher",
				newWords: ["v19", "v20", "v21"],
				grammarPoints: ["g5"], // Also
			},
			{
				id: "lesson-2-2",
				name: "Relationships",
				description: "Friend, Family",
				newWords: ["v22", "v23"],
			},
			{
				id: "lesson-2-3",
				name: "Origins",
				description: "China, Chinese language, To be called",
				newWords: ["v24", "v25", "v26"],
			},
			{
				id: "lesson-2-4",
				name: "Actions",
				description: "To study, To want/think",
				newWords: ["v27", "v28"],
				grammarPoints: ["g6"], // Want to
			},
		],
	},
	{
		id: "unit-3",
		name: "Survival",
		description: "Essential words for eating and drinking.",
		color: "#D4AF37",
		lessons: [
			{
				id: "lesson-3-1",
				name: "Drinks",
				description: "Water, Tea, Coffee",
				newWords: ["v29", "v30", "v31"],
			},
			{
				id: "lesson-3-2",
				name: "Food",
				description: "Rice, Chinese Food",
				newWords: ["v32", "v33"],
				grammarPoints: ["g7"], // Completed action
			},
			{
				id: "lesson-3-3",
				name: "Eating Actions",
				description: "Eat, Drink",
				newWords: ["v34", "v35"],
			},
			{
				id: "lesson-3-4",
				name: "Shopping",
				description: "Buy, Money, How much",
				newWords: ["v36", "v37", "v38"],
			},
		],
	},
	{
		id: "unit-4",
		name: "Time & Place",
		description: "Navigate through time and space.",
		color: "#E5C85C",
		lessons: [
			{
				id: "lesson-4-1",
				name: "Time",
				description: "Today, Tomorrow, Yesterday",
				newWords: ["v39", "v40", "v41"],
			},
			{
				id: "lesson-4-2",
				name: "Movement",
				description: "Go, Come",
				newWords: ["v42", "v43"],
			},
			{
				id: "lesson-4-3",
				name: "Places",
				description: "School, Shop",
				newWords: ["v44", "v45"],
			},
		],
	},
	{
		id: "unit-5",
		name: "Description",
		description: "Describe the world around you.",
		color: "#3B82F6",
		lessons: [
			{
				id: "lesson-5-1",
				name: "Size",
				description: "Big, Small",
				newWords: ["v46", "v47"],
			},
			{
				id: "lesson-5-2",
				name: "Feelings",
				description: "Beautiful, Happy",
				newWords: ["v48", "v49"],
			},
			{
				id: "lesson-5-3",
				name: "Intensifiers",
				description: "Extremely",
				newWords: ["v50"],
			},
		],
	},
	{
		id: "unit-6",
		name: "Integration",
		description: "Put it all together.",
		color: "#22C55E",
		lessons: [
			{
				id: "lesson-6-1",
				name: "Reading",
				description: "Look/Read, Book",
				newWords: ["v51", "v52"],
			},
			{
				id: "lesson-6-2",
				name: "Preferences",
				description: "Like, Cat, Dog",
				newWords: ["v53", "v54", "v55"],
				grammarPoints: ["g8"], // Like to
			},
			{
				id: "lesson-6-3",
				name: "Social",
				description: "We, Speak",
				newWords: ["v56", "v57"],
			},
		],
	},
];

// ── Grammar Points ──
export const GRAMMAR_POINTS: GrammarPoint[] = [
	{
		id: "g1",
		pattern: "S + 是 + O",
		english: "A is B",
		example: "我是学生",
		examplePinyin: "Wǒ shì xuéshēng",
		exampleEnglish: "I am a student",
		week: 1,
	},
	{
		id: "g2",
		pattern: "S + 不 + V",
		english: "Negation",
		example: "我不喝茶",
		examplePinyin: "Wǒ bù hē chá",
		exampleEnglish: "I don't drink tea",
		week: 2,
	},
	{
		id: "g3",
		pattern: "S + V + O + 吗？",
		english: "Yes/no question",
		example: "你好吗？",
		examplePinyin: "Nǐ hǎo ma?",
		exampleEnglish: "Are you well?",
		week: 3,
	},
	{
		id: "g4",
		pattern: "S + 很 + Adj",
		english: "Very + adj",
		example: "她很好",
		examplePinyin: "Tā hěn hǎo",
		exampleEnglish: "She is very good",
		week: 4,
	},
	{
		id: "g5",
		pattern: "S + 也 + V",
		english: "Also",
		example: "我也喜欢",
		examplePinyin: "Wǒ yě xǐhuān",
		exampleEnglish: "I also like it",
		week: 5,
	},
	{
		id: "g6",
		pattern: "S + 想 + V",
		english: "Want to",
		example: "我想去",
		examplePinyin: "Wǒ xiǎng qù",
		exampleEnglish: "I want to go",
		week: 8,
	},
	{
		id: "g7",
		pattern: "S + V + 了",
		english: "Completed action",
		example: "我吃了",
		examplePinyin: "Wǒ chī le",
		exampleEnglish: "I ate",
		week: 10,
	},
	{
		id: "g8",
		pattern: "S + 喜欢 + V/O",
		english: "Like to / like",
		example: "我喜欢猫",
		examplePinyin: "Wǒ xǐhuān māo",
		exampleEnglish: "I like cats",
		week: 22,
	},
];

// ── Tone Info ──
export const TONE_CHART = [
	{
		tone: 1,
		name: "High Level",
		symbol: "¯",
		pitch: "55",
		description: "Steady high pitch, like sustaining a musical note",
		example: "妈 (mā) — mother",
	},
	{
		tone: 2,
		name: "Rising",
		symbol: "´",
		pitch: "35",
		description: "Rising from mid to high, like asking 'what?'",
		example: "麻 (má) — hemp",
	},
	{
		tone: 3,
		name: "Dipping",
		symbol: "ˇ",
		pitch: "214",
		description: "Falls then rises, like saying 'well...'",
		example: "马 (mǎ) — horse",
	},
	{
		tone: 4,
		name: "Falling",
		symbol: "` ",
		pitch: "51",
		description: "Sharp fall from high to low, like a command",
		example: "骂 (mà) — scold",
	},
	{
		tone: 5,
		name: "Neutral",
		symbol: "·",
		pitch: "—",
		description: "Light, short, unstressed",
		example: "吗 (ma) — question",
	},
];

// ── Helper Functions ──
export function getCardColor(type: VocabEntry["type"]): string {
	const colors: Record<VocabEntry["type"], string> = {
		noun: "var(--color-card-noun)",
		verb: "var(--color-card-verb)",
		adjective: "var(--color-card-adj)",
		particle: "var(--color-card-particle)",
	};
	return colors[type];
}

export function getCardColorClass(type: VocabEntry["type"]): string {
	const classes: Record<VocabEntry["type"], string> = {
		noun: "from-[var(--color-card-noun-dark)] to-[var(--color-card-noun)]",
		verb: "from-[var(--color-card-verb-dark)] to-[var(--color-card-verb)]",
		adjective: "from-[var(--color-card-adj-dark)] to-[var(--color-card-adj)]",
		particle:
			"from-[var(--color-card-particle-dark)] to-[var(--color-card-particle)]",
	};
	return classes[type];
}

export function getCardLabel(type: VocabEntry["type"]): string {
	const labels: Record<VocabEntry["type"], string> = {
		noun: "NOUN",
		verb: "VERB",
		adjective: "ADJ",
		particle: "LOGIC",
	};
	return labels[type];
}

export function getVocabularyByWeek(week: number): VocabEntry[] {
	return HSK1_VOCABULARY.filter((v) => v.week === week);
}

export function getVocabularyByPhase(phase: RoadmapPhase): VocabEntry[] {
	return HSK1_VOCABULARY.filter((v) => phase.weeks.includes(v.week));
}
