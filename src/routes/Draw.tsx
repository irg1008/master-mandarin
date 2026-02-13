import { DrawView } from "@/components/DrawView";

export function Draw() {
  return <DrawView onAudioError={(msg) => console.error(msg)} />;
}
