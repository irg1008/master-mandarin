import { CurriculumView } from "@/components/CurriculumView";
import { useProgress } from "@/context/ProgressContext";

export function Curriculum() {
  const { progress } = useProgress();

  return (
    <CurriculumView
      unlockedCards={progress.unlockedCards}
      onAudioError={(msg) => console.error(msg)}
    />
  );
}
