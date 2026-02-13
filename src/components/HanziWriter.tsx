import { useEffect, useRef } from "react";
// hanzi-writer exports as a class, not a default export
import * as HanziWriterLib from "hanzi-writer";

// Resolve the actual constructor — handles both ESM default and CJS module patterns
const HanziWriterClass = (HanziWriterLib as any).default ?? HanziWriterLib;

export interface HanziWriterProps {
  /** The Chinese character to render */
  character: string;
  /** Width/height of the drawing canvas in px */
  size?: number;
  /** Whether to start in quiz mode immediately */
  quiz?: boolean;
  /** Show the character outline (ghost strokes) */
  showOutline?: boolean;
  /** Callback when quiz is completed */
  onComplete?: (summaryData: { character: string; totalMistakes: number }) => void;
  /** Callback on wrong stroke */
  onMistake?: (strokeData: { strokeNum: number; mistakesOnStroke: number; totalMistakes: number; strokesRemaining: number }) => void;
}

/**
 * React wrapper around the `hanzi-writer` library.
 * Renders an interactive Chinese character writer/quiz.
 */
export function HanziWriter({
  character,
  size = 220,
  quiz = false,
  showOutline = true,
  onComplete,
  onMistake,
}: HanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Clean previous
    el.innerHTML = "";
    writerRef.current = null;

    try {
      const writer = HanziWriterClass.create(el, character, {
        width: size,
        height: size,
        padding: 16,
        showCharacter: !quiz,
        showOutline,
        strokeAnimationSpeed: 1.5,
        delayBetweenStrokes: 300,
        strokeColor: "#333333",
        outlineColor: "#cccccc",
        drawingColor: "#C41E3A",
        highlightColor: "#D4AF37",
        drawingWidth: 6,
        showHintAfterMisses: 3,
        highlightOnComplete: true,
        renderer: "svg",
        onLoadCharDataError: (reason: any) => {
          console.error("[HanziWriter] Failed to load data for", character, reason);
        },
      });

      writerRef.current = writer;

      if (quiz) {
        writer.quiz({
          onComplete: (data: any) => onComplete?.(data),
          onMistake: (data: any) => onMistake?.(data),
        });
      } else {
        // Auto-animate stroke order in "watch" mode
        setTimeout(() => writer.animateCharacter(), 400);
      }
    } catch (err) {
      console.error("[HanziWriter] Error creating instance:", err);
    }

    return () => {
      if (el) el.innerHTML = "";
      writerRef.current = null;
    };
  }, [character, size, quiz, showOutline]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="inline-flex flex-col items-center">
      <div
        ref={containerRef}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: "2px solid var(--border)",
          borderRadius: "1rem",
          background: "var(--card)",
        }}
      />
    </div>
  );
}

HanziWriter.displayName = "HanziWriter";
