import { useRef, useEffect, useMemo } from "react";
import { Star, Lock, Check, ChevronRight } from "lucide-react";
import { COURSE_CONTENT, type Unit, type Lesson } from "@/data/hsk1-vocabulary";

interface RoadmapViewProps {
  currentUnitId: string;
  currentLessonId: string;
  completedLessons: string[];
  onStartLesson: (unit: Unit, lesson: Lesson) => void;
}

export function RoadmapView({
  currentUnitId,
  currentLessonId,
  completedLessons,
  onStartLesson,
}: RoadmapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build a flat ordered list of lesson IDs for determining lock state
  const allLessonIds = useMemo(() => {
    return COURSE_CONTENT.flatMap((u) => u.lessons.map((l) => l.id));
  }, []);

  const currentLessonIndex = allLessonIds.indexOf(currentLessonId);

  // Scroll to active lesson on mount
  useEffect(() => {
    if (containerRef.current) {
      const activeNode = containerRef.current.querySelector("[data-active='true']");
      if (activeNode) {
        activeNode.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentLessonId]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-lg mx-auto py-8 px-4 animate-fade-in pb-32 relative"
    >
      {/* Main vertical ink stroke / path line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-0.75 -translate-x-1/2 opacity-15"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--foreground) 5%, var(--foreground) 95%, transparent)",
        }}
      />

      {COURSE_CONTENT.map((unit, unitIndex) => {
        // Check how many lessons in this unit are completed
        const completedInUnit = unit.lessons.filter((l) =>
          completedLessons.includes(l.id)
        ).length;
        const totalInUnit = unit.lessons.length;
        const unitProgress = totalInUnit > 0 ? (completedInUnit / totalInUnit) * 100 : 0;

        return (
          <div key={unit.id} className="relative mb-16">
            {/* ─── Unit Banner ─── */}
            <div className="relative z-10 mx-auto max-w-sm mb-10">
              <div
                className="relative overflow-hidden rounded-2xl p-5 border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${unit.color}dd, ${unit.color}88)`,
                }}
              >
                {/* Decorative brush stroke overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 0 50 10 Q75 20 100 10' stroke='white' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "100px 20px",
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Unit {unitIndex + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {unit.name}
                    </h3>
                    <p className="text-sm text-white/80 mt-0.5">{unit.description}</p>
                  </div>

                  {/* Circular progress indicator */}
                  <div className="relative w-14 h-14 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="3"
                        strokeDasharray={`${unitProgress} ${100 - unitProgress}`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {completedInUnit}/{totalInUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Lessons Path ─── */}
            <div className="flex flex-col items-center gap-2">
              {unit.lessons.map((lesson, lessonIndex) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = lesson.id === currentLessonId;
                const globalIndex = allLessonIds.indexOf(lesson.id);
                const isLocked = !isCompleted && globalIndex > currentLessonIndex;

                // Zigzag offset
                const xOffset = lessonIndex % 2 === 0 ? -48 : 48;

                return (
                  <div
                    key={lesson.id}
                    data-active={isCurrent}
                    className="relative flex flex-col items-center py-3"
                    style={{
                      transform: `translateX(${xOffset}px)`,
                      transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {/* Node */}
                    <button
                      onClick={() => !isLocked && onStartLesson(unit, lesson)}
                      disabled={isLocked}
                      data-testid={`lesson-node-${lesson.id}`}
                      className={`
                        lesson-node relative group
                        ${isCurrent ? "w-18 h-18" : "w-15 h-15"}
                        rounded-full flex items-center justify-center
                        transition-all duration-300 ease-out
                        ${isLocked
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:scale-110 active:scale-95"
                        }
                      `}
                      style={
                        isLocked
                          ? { background: "var(--muted)" }
                          : isCompleted
                            ? {
                              background: `linear-gradient(135deg, ${unit.color}, ${unit.color}aa)`,
                              boxShadow: `0 4px 20px ${unit.color}40`,
                            }
                            : {
                              background: `linear-gradient(135deg, ${unit.color}, ${unit.color}cc)`,
                              boxShadow: `0 4px 24px ${unit.color}50, 0 0 0 4px ${unit.color}30`,
                              animation: "glow-pulse 2s ease-in-out infinite",
                            }
                      }
                    >
                      {isCompleted ? (
                        <Check className="w-7 h-7 text-white" strokeWidth={3} />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Star
                          className="w-7 h-7 text-white drop-shadow-sm"
                          fill="currentColor"
                        />
                      )}

                      {/* Ripple ring for current */}
                      {isCurrent && (
                        <span
                          className="absolute inset-0 rounded-full animate-ping opacity-30"
                          style={{ background: unit.color }}
                        />
                      )}
                    </button>

                    {/* Label */}
                    <div
                      className={`
                        mt-2.5 px-3 py-1.5 rounded-xl text-center max-w-40
                        transition-all duration-300
                        ${isCurrent
                          ? "bg-card border border-border shadow-md"
                          : isCompleted
                            ? "bg-card/60 border border-border/50"
                            : "opacity-0"
                        }
                      `}
                    >
                      <span className="text-xs font-bold text-foreground block leading-tight">
                        {lesson.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5 mt-0.5">
                          Tap to start <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* End of Content */}
      <div className="text-center py-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm">
          <span>More units coming soon</span>
          <span className="text-lg">🐉</span>
        </div>
      </div>
    </div>
  );
}
