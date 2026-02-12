const AUDIO_BASE_URL =
  "https://raw.githubusercontent.com/hugolpz/audio-cmn/master/96k/hsk/";

export function playAudio(
  hanzi: string,
  onError?: (message: string) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `${AUDIO_BASE_URL}cmn-${encodeURIComponent(hanzi)}.mp3`;
    const audio = new Audio(url);

    audio.addEventListener("canplaythrough", () => {
      audio.play().then(resolve).catch((err) => {
        const msg = `Could not play audio for "${hanzi}". Please check your speakers.`;
        onError?.(msg);
        reject(err);
      });
    });

    audio.addEventListener("error", () => {
      const msg = `Audio file not found for "${hanzi}". The pronunciation may not be available yet.`;
      onError?.(msg);
      reject(new Error(msg));
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      const msg = `Audio loading timed out for "${hanzi}". Please check your connection.`;
      onError?.(msg);
      reject(new Error(msg));
    }, 5000);
  });
}
