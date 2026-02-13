import { RoadmapView } from "@/components/RoadmapView";
import { useProgress } from "@/context/ProgressContext";
import { useNavigate } from "@tanstack/react-router";

export function Home() {
  const { progress } = useProgress();
  const navigate = useNavigate();

  return (
    <RoadmapView
      currentUnitId={progress.currentUnitId}
      currentLessonId={progress.currentLessonId}
      completedLessons={progress.completedLessons}
      onStartLesson={(_, lesson) => {
        navigate({ to: "/lesson/$lessonId", params: { lessonId: lesson.id } });
      }}
    />
  );
}
