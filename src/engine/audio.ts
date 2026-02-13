const AUDIO_BASE_URL =
	"https://raw.githubusercontent.com/hugolpz/audio-cmn/master/96k/hsk/";

export function playAudio(
	hanzi: string,
	onError?: (message: string) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const url = `${AUDIO_BASE_URL}cmn-${encodeURIComponent(hanzi)}.mp3`;
		const audio = new Audio(url);

		const timeoutId = setTimeout(() => {
			const msg = `Audio loading timed out for "${hanzi}". Please check your connection.`;
			onError?.(msg);
			reject(new Error(msg));
		}, 8000);

		const cleanup = () => clearTimeout(timeoutId);

		audio.addEventListener(
			"canplaythrough",
			() => {
				cleanup();
				audio
					.play()
					.then(resolve)
					.catch((err) => {
						const msg = `Could not play audio for "${hanzi}". Please check your speakers.`;
						// onError?.(msg); // Optional: suppress if just autoplay policy
						reject(err);
					});
			},
			{ once: true },
		);

		audio.addEventListener(
			"error",
			() => {
				cleanup();
				// If it's a 404 we didn't catch in our list
				const msg = `Audio file not found for "${hanzi}".`;
				// onError?.(msg); // Suppress 404 alerts for cleaner UI?
				console.warn(msg);
				reject(new Error(msg));
			},
			{ once: true },
		);
	});
}
