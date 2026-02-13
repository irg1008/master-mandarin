import { useParams, useNavigate } from "@tanstack/react-router";
import { LessonSession } from "@/components/LessonSession";
import { useProgress } from "@/context/ProgressContext";
import { COURSE_CONTENT } from "@/data/hsk1-vocabulary";

export function Lesson() {
  const params = useParams({ strict: false });
  const lessonId = (params as any).lessonId;
  const { addXP, completeLesson, updateStreak } = useProgress();
  const navigate = useNavigate();

  // Find lesson
  let currentLesson = null;
  for (const unit of COURSE_CONTENT) {
    const found = unit.lessons.find((l) => l.id === lessonId);
    if (found) {
      currentLesson = found;
      break;
    }
  }

  if (!currentLesson) {
    return <div className="p-8 text-center">Lesson not found: {lessonId}</div>;
  }

  const handleLessonComplete = (xpEarned: number) => {
    // Find unlocked words
    // Simplified logic as per original
    let newUnlockedIds: string[] = currentLesson.newWords;

    addXP(xpEarned);
    completeLesson(lessonId, newUnlockedIds);
    updateStreak();

    navigate({ to: "/" });
  };

  const handleLessonExit = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      {/* Note: LessonSession takes full screen, no HeaderBar usually */}
      {/* But RootLayout provides HeaderBar. We might want to hide it. */}
      {/* For now, just render inside main layout or overwrite CSS? */}
      {/* Actually, user said "Tab should correspond to route". Lesson is modal-like. */}
      {/* Ideally Lesson route should NOT share RootLayout with HeaderBar. */}
      {/* I will configure router to have root layout for tabs, and minimal layout for Lesson. */}
      {/* But for now, let's just render it. The CSS ensures min-h-screen background covers everything. */}
      {/* If we want to hide header, we need a different route hierarchy. */}
      {/* Let's assume header is fine or we'll adjust router structure later. */}
      <LessonSession
        lesson={currentLesson}
        onComplete={handleLessonComplete}
        onExit={handleLessonExit}
      />
    </div>
  );
}
