# Mandarin Master 🀄

Mandarin Master is a beautiful, interactive web application designed to help users master HSK1 Chinese vocabulary and sentence structure through gamified learning.

## 🎯 Goal

The primary aim of this project is to provide an engaging, aesthetically pleasing platform for learning Mandarin Chinese, specifically targeting the **HSK1 (Hanyu Shuiping Kaoshi Level 1)** proficiency level. It focuses on:
-   **Vocabulary Acquisition:** Learning and retaining essential characters.
-   **Sentence Construction:** Understanding grammar and word order (SVO/SAVO structures).
-   **Pronunciation:** Listening to native audio for every word.

## ✨ Features

### 1. 📚 Vocabulary Collection
-   Explore a comprehensive list of HSK1 words.
-   **Interactive Cards:** Beautiful, 3D-flippable cards showing Hanzi, Pinyin, and English translations.
-   **Audio Pronunciation:** Click any unlocked card to hear its native pronunciation.
-   **Smart Grouping:** Words are categorized by grammar type (Noun, Verb, Adjective, Particle) with distinct color coding.

### 2. ⚔️ Sentence Duel
-   **Gamified Syntax Practice:** A drag-and-drop game where you build correct sentences from scrambled characters.
-   **Duel Mode:** Test your skills against the "Master" by translating English sentences into Chinese.
-   **Streaks & XP:** Earn experience points and build win streaks to level up your profile.
-   **Instant Feedback:** Get immediate visual and audio feedback on your answers.

### 3. 🎨 Responsive & Themed UI
-   **Imperial Theme:** A custom "Imperial Red & Gold" theme inspired by traditional Chinese aesthetics.
-   **Dark/Light Mode:** Seamlessly switch between light and dark themes.
-   **Mobile-First Design:** Fully responsive layout that works perfectly on desktop and mobile devices.

## 🛠️ Tech Stack

-   **Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Audio:** Native HTML5 Audio with custom engine

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run the development server:**
    ```bash
    pnpm dev
    ```

3.  **Build for production:**
    ```bash
    pnpm build
    ```

## 📂 Project Structure

-   `src/components`: Reusable UI components (VocabularyCard, HeaderBar, etc.)
-   `src/data`: HSK1 vocabulary list and game data
-   `src/engine`: Game logic for duels and audio handling
-   `src/assets`: Static assets like audio files and images

---
*Built with ❤️ for Mandarin learners.*
