export interface VocabEntry {
  hanzi: string;
  pinyin: string;
  english: string;
  type: "noun" | "verb" | "adjective" | "particle";
  radical?: string;
  radicalMeaning?: string;
  toneNumber: 1 | 2 | 3 | 4 | 5;
  week: number;
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

// ── 24-Week Roadmap ──
export const ROADMAP_PHASES: RoadmapPhase[] = [
  { name: "Foundations", weeks: [1, 2, 3, 4], description: "Pinyin, tones, basic greetings, numbers 1-10", color: "#C41E3A" },
  { name: "Identity", weeks: [5, 6, 7, 8], description: "Self-introduction, family, nationality, age", color: "#E63950" },
  { name: "Survival", weeks: [9, 10, 11, 12], description: "Food, drink, shopping, directions", color: "#D4AF37" },
  { name: "Time & Place", weeks: [13, 14, 15, 16], description: "Days, months, locations, transportation", color: "#E5C85C" },
  { name: "Description", weeks: [17, 18, 19, 20], description: "Colors, sizes, weather, feelings", color: "#3B82F6" },
  { name: "Integration", weeks: [21, 22, 23, 24], description: "Complex sentences, storytelling, review", color: "#22C55E" },
];

// ── Radical-Semantic Mapping ──
export const RADICAL_MAP: Record<string, string> = {
  "氵": "water",
  "亻": "person",
  "口": "mouth",
  "女": "woman",
  "木": "wood/tree",
  "日": "sun/day",
  "月": "moon/month",
  "心": "heart",
  "忄": "heart (left)",
  "手": "hand",
  "扌": "hand (left)",
  "火": "fire",
  "灬": "fire (bottom)",
  "土": "earth",
  "金": "metal/gold",
  "钅": "metal (left)",
  "食": "food",
  "饣": "food (left)",
  "言": "speech",
  "讠": "speech (left)",
  "走": "walk",
  "足": "foot",
  "目": "eye",
  "耳": "ear",
  "门": "door",
  "草": "grass",
  "艹": "grass (top)",
  "雨": "rain",
  "山": "mountain",
  "石": "stone",
  "田": "field",
  "力": "power",
  "刀": "knife",
  "大": "big",
  "小": "small",
};

// ── HSK 3.0 Level 1 Vocabulary (representative subset) ──
export const HSK1_VOCABULARY: VocabEntry[] = [
  // Week 1-4: Foundations
  { hanzi: "我", pinyin: "wǒ", english: "I, me", type: "noun", toneNumber: 3, week: 1 },
  { hanzi: "你", pinyin: "nǐ", english: "you", type: "noun", toneNumber: 3, week: 1 },
  { hanzi: "他", pinyin: "tā", english: "he, him", type: "noun", toneNumber: 1, week: 1 },
  { hanzi: "她", pinyin: "tā", english: "she, her", type: "noun", toneNumber: 1, week: 1 },
  { hanzi: "好", pinyin: "hǎo", english: "good", type: "adjective", toneNumber: 3, week: 1 },
  { hanzi: "是", pinyin: "shì", english: "to be", type: "verb", toneNumber: 4, week: 1 },
  { hanzi: "不", pinyin: "bù", english: "not, no", type: "particle", toneNumber: 4, week: 1 },
  { hanzi: "的", pinyin: "de", english: "possessive particle", type: "particle", toneNumber: 5, week: 1 },
  { hanzi: "一", pinyin: "yī", english: "one", type: "noun", toneNumber: 1, week: 2 },
  { hanzi: "二", pinyin: "èr", english: "two", type: "noun", toneNumber: 4, week: 2 },
  { hanzi: "三", pinyin: "sān", english: "three", type: "noun", toneNumber: 1, week: 2 },
  { hanzi: "四", pinyin: "sì", english: "four", type: "noun", toneNumber: 4, week: 2 },
  { hanzi: "五", pinyin: "wǔ", english: "five", type: "noun", toneNumber: 3, week: 2 },
  { hanzi: "很", pinyin: "hěn", english: "very", type: "particle", toneNumber: 3, week: 3 },
  { hanzi: "吗", pinyin: "ma", english: "question particle", type: "particle", toneNumber: 5, week: 3 },
  { hanzi: "了", pinyin: "le", english: "completed action", type: "particle", toneNumber: 5, week: 3 },
  { hanzi: "也", pinyin: "yě", english: "also", type: "particle", toneNumber: 3, week: 4 },
  { hanzi: "都", pinyin: "dōu", english: "all, both", type: "particle", toneNumber: 1, week: 4 },

  // Week 5-8: Identity
  { hanzi: "人", pinyin: "rén", english: "person", type: "noun", radical: "亻", radicalMeaning: "person", toneNumber: 2, week: 5 },
  { hanzi: "学生", pinyin: "xuéshēng", english: "student", type: "noun", toneNumber: 2, week: 5 },
  { hanzi: "老师", pinyin: "lǎoshī", english: "teacher", type: "noun", toneNumber: 3, week: 5 },
  { hanzi: "朋友", pinyin: "péngyǒu", english: "friend", type: "noun", toneNumber: 2, week: 6 },
  { hanzi: "家", pinyin: "jiā", english: "home, family", type: "noun", toneNumber: 1, week: 6 },
  { hanzi: "中国", pinyin: "Zhōngguó", english: "China", type: "noun", toneNumber: 1, week: 7 },
  { hanzi: "中文", pinyin: "Zhōngwén", english: "Chinese (language)", type: "noun", toneNumber: 1, week: 7 },
  { hanzi: "叫", pinyin: "jiào", english: "to be called", type: "verb", toneNumber: 4, week: 7 },
  { hanzi: "学", pinyin: "xué", english: "to study", type: "verb", radical: "子", radicalMeaning: "child", toneNumber: 2, week: 8 },
  { hanzi: "想", pinyin: "xiǎng", english: "to want, to think", type: "verb", radical: "心", radicalMeaning: "heart", toneNumber: 3, week: 8 },

  // Week 9-12: Survival
  { hanzi: "水", pinyin: "shuǐ", english: "water", type: "noun", radical: "氵", radicalMeaning: "water", toneNumber: 3, week: 9 },
  { hanzi: "茶", pinyin: "chá", english: "tea", type: "noun", radical: "艹", radicalMeaning: "grass", toneNumber: 2, week: 9 },
  { hanzi: "咖啡", pinyin: "kāfēi", english: "coffee", type: "noun", toneNumber: 1, week: 9 },
  { hanzi: "饭", pinyin: "fàn", english: "rice, meal", type: "noun", radical: "饣", radicalMeaning: "food", toneNumber: 4, week: 10 },
  { hanzi: "中国菜", pinyin: "Zhōngguó cài", english: "Chinese food", type: "noun", toneNumber: 1, week: 10 },
  { hanzi: "喝", pinyin: "hē", english: "to drink", type: "verb", radical: "口", radicalMeaning: "mouth", toneNumber: 1, week: 10 },
  { hanzi: "吃", pinyin: "chī", english: "to eat", type: "verb", radical: "口", radicalMeaning: "mouth", toneNumber: 1, week: 10 },
  { hanzi: "买", pinyin: "mǎi", english: "to buy", type: "verb", toneNumber: 3, week: 11 },
  { hanzi: "钱", pinyin: "qián", english: "money", type: "noun", radical: "钅", radicalMeaning: "metal", toneNumber: 2, week: 11 },
  { hanzi: "多少", pinyin: "duōshǎo", english: "how much / many", type: "particle", toneNumber: 1, week: 11 },

  // Week 13-16: Time & Place
  { hanzi: "今天", pinyin: "jīntiān", english: "today", type: "noun", toneNumber: 1, week: 13 },
  { hanzi: "明天", pinyin: "míngtiān", english: "tomorrow", type: "noun", toneNumber: 2, week: 13 },
  { hanzi: "昨天", pinyin: "zuótiān", english: "yesterday", type: "noun", toneNumber: 2, week: 13 },
  { hanzi: "去", pinyin: "qù", english: "to go", type: "verb", toneNumber: 4, week: 14 },
  { hanzi: "来", pinyin: "lái", english: "to come", type: "verb", toneNumber: 2, week: 14 },
  { hanzi: "学校", pinyin: "xuéxiào", english: "school", type: "noun", toneNumber: 2, week: 15 },
  { hanzi: "商店", pinyin: "shāngdiàn", english: "shop", type: "noun", toneNumber: 1, week: 15 },

  // Week 17-20: Description
  { hanzi: "大", pinyin: "dà", english: "big", type: "adjective", toneNumber: 4, week: 17 },
  { hanzi: "小", pinyin: "xiǎo", english: "small", type: "adjective", toneNumber: 3, week: 17 },
  { hanzi: "漂亮", pinyin: "piàoliang", english: "beautiful", type: "adjective", toneNumber: 4, week: 18 },
  { hanzi: "高兴", pinyin: "gāoxìng", english: "happy", type: "adjective", toneNumber: 1, week: 18 },
  { hanzi: "非常", pinyin: "fēicháng", english: "extremely", type: "particle", toneNumber: 1, week: 19 },

  // Week 21-24: Integration
  { hanzi: "看", pinyin: "kàn", english: "to look, to read", type: "verb", radical: "目", radicalMeaning: "eye", toneNumber: 4, week: 21 },
  { hanzi: "书", pinyin: "shū", english: "book", type: "noun", toneNumber: 1, week: 21 },
  { hanzi: "喜欢", pinyin: "xǐhuān", english: "to like", type: "verb", toneNumber: 3, week: 22 },
  { hanzi: "猫", pinyin: "māo", english: "cat", type: "noun", toneNumber: 1, week: 22 },
  { hanzi: "狗", pinyin: "gǒu", english: "dog", type: "noun", toneNumber: 3, week: 22 },
  { hanzi: "我们", pinyin: "wǒmen", english: "we, us", type: "noun", toneNumber: 3, week: 23 },
  { hanzi: "说", pinyin: "shuō", english: "to speak", type: "verb", radical: "讠", radicalMeaning: "speech", toneNumber: 1, week: 24 },
];

// ── Grammar Points ──
export const GRAMMAR_POINTS: GrammarPoint[] = [
  { id: "g1", pattern: "S + 是 + O", english: "A is B", example: "我是学生", examplePinyin: "Wǒ shì xuéshēng", exampleEnglish: "I am a student", week: 1 },
  { id: "g2", pattern: "S + 不 + V", english: "Negation", example: "我不喝茶", examplePinyin: "Wǒ bù hē chá", exampleEnglish: "I don't drink tea", week: 2 },
  { id: "g3", pattern: "S + V + O + 吗？", english: "Yes/no question", example: "你好吗？", examplePinyin: "Nǐ hǎo ma?", exampleEnglish: "Are you well?", week: 3 },
  { id: "g4", pattern: "S + 很 + Adj", english: "Very + adj", example: "她很好", examplePinyin: "Tā hěn hǎo", exampleEnglish: "She is very good", week: 4 },
  { id: "g5", pattern: "S + 也 + V", english: "Also", example: "我也喜欢", examplePinyin: "Wǒ yě xǐhuān", exampleEnglish: "I also like it", week: 5 },
  { id: "g6", pattern: "S + 想 + V", english: "Want to", example: "我想去", examplePinyin: "Wǒ xiǎng qù", exampleEnglish: "I want to go", week: 8 },
  { id: "g7", pattern: "S + V + 了", english: "Completed action", example: "我吃了", examplePinyin: "Wǒ chī le", exampleEnglish: "I ate", week: 10 },
  { id: "g8", pattern: "S + 喜欢 + V/O", english: "Like to / like", example: "我喜欢猫", examplePinyin: "Wǒ xǐhuān māo", exampleEnglish: "I like cats", week: 22 },
];

// ── Tone Info ──
export const TONE_CHART = [
  { tone: 1, name: "High Level", symbol: "¯", pitch: "55", description: "Steady high pitch, like sustaining a musical note", example: "妈 (mā) — mother" },
  { tone: 2, name: "Rising", symbol: "´", pitch: "35", description: "Rising from mid to high, like asking 'what?'", example: "麻 (má) — hemp" },
  { tone: 3, name: "Dipping", symbol: "ˇ", pitch: "214", description: "Falls then rises, like saying 'well...'", example: "马 (mǎ) — horse" },
  { tone: 4, name: "Falling", symbol: "` ", pitch: "51", description: "Sharp fall from high to low, like a command", example: "骂 (mà) — scold" },
  { tone: 5, name: "Neutral", symbol: "·", pitch: "—", description: "Light, short, unstressed", example: "吗 (ma) — question" },
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
    particle: "from-[var(--color-card-particle-dark)] to-[var(--color-card-particle)]",
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
