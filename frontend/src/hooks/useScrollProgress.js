import { useEffect } from "react";

export function useScrollProgress(videoRef) {
	useEffect(() => {
		const video = videoRef.current;

		if (!video) return;

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const videoRect = video.getBoundingClientRect();
			const videoTop = scrollTop + videoRect.top;
			const videoHeight = video.offsetHeight;

			const scrollWithinVideo = Math.max(
				0,
				scrollTop - videoTop + window.innerHeight
			);
			const scrollProgress = Math.min(1, scrollWithinVideo / videoHeight);

			// Sync video playback with scroll position
			if (video.duration) {
				video.currentTime = scrollProgress * video.duration;
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, [videoRef]);
}
