import { useEffect, useRef } from "react";

export function useFrameSequenceCanvas(
  canvasRef,
  frameStart = 1,
  frameEnd = 290,
  framePath = "/Video/frame_"
) {
  const framesRef = useRef([]);
  const isMountedRef = useRef(true);

  /* ---------------------------
     PRELOAD FRAMES
  ---------------------------- */
  useEffect(() => {
    isMountedRef.current = true;

    const frames = [];
    for (let i = frameStart; i <= frameEnd; i++) {
      const img = new Image();
      const paddedNum = String(i).padStart(4, "0");
      img.src = `${framePath}${paddedNum}.webp`;
      frames.push(img);
    }

    framesRef.current = frames;

    return () => {
      isMountedRef.current = false;
    };
  }, [frameStart, frameEnd, framePath]);

  /* ---------------------------
     SCROLL + RENDER LOGIC
  ---------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const totalFrames = frameEnd - frameStart + 1;

    const renderFrame = (index) => {
      if (!isMountedRef.current) return;
      if (!framesRef.current.length) return;

      // Clamp index safely
      const safeIndex = Math.max(
        0,
        Math.min(index, framesRef.current.length - 1)
      );

      const frame = framesRef.current[safeIndex];

      if (!frame) return;
      if (!frame.complete) return;

      canvas.width = frame.naturalWidth;
      canvas.height = frame.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frame, 0, 0);
    };

    const handleScroll = () => {
      if (!isMountedRef.current) return;

      const container = canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;

      if (containerHeight === 0) return;

      // How far container has moved past viewport top
      const scrollWithinContainer = -rect.top;

      const progress = Math.max(
        0,
        Math.min(1, scrollWithinContainer / containerHeight)
      );

      const frameIndex = Math.floor(progress * (totalFrames - 1));

      renderFrame(frameIndex);
    };

    window.addEventListener("scroll", handleScroll);

    // Try rendering first frame safely
    renderFrame(0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  },[frameStart, frameEnd, framePath, canvasRef]);

}
