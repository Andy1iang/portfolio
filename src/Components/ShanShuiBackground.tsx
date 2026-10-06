import { useEffect, useRef, useState } from "react";
import { ShanShuiBackdrop } from "../backdrop/ShanShuiBackdrop.js";
import { shanShuiConfig } from "../backdrop/config.js";

const INITIAL_CHUNKS = Array.from(
  { length: shanShuiConfig.initialChunkCount },
  (_, index) => index,
);
const CHUNK_WIDTH_VH =
  (shanShuiConfig.chunkWidth / shanShuiConfig.logicalHeight) * 100;
const FIRST_CHUNK_IMAGE_STYLE = {
  left: 0,
  width: `${
    ((shanShuiConfig.chunkWidth + shanShuiConfig.tileGutter) /
      shanShuiConfig.chunkWidth) *
    100
  }%`,
};
const CHUNK_IMAGE_STYLE = {
  left: `${(-shanShuiConfig.tileGutter / shanShuiConfig.chunkWidth) * 100}%`,
  width: `${
    ((shanShuiConfig.chunkWidth + shanShuiConfig.tileGutter * 2) /
      shanShuiConfig.chunkWidth) *
    100
  }%`,
};

export default function ShanShuiBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const initialChunksRef = useRef<HTMLDivElement>(null);
  const [initialChunksMounted, setInitialChunksMounted] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const backdrop = new ShanShuiBackdrop(mountRef.current, {
      seed: shanShuiConfig.seed,
      speed: motionPreference.matches ? 0 : 20,
      savedChunks: {
        baseUrl: shanShuiConfig.savedChunkBaseUrl,
        count: shanShuiConfig.savedChunkCount,
      },
      onInitialFrameReady: () => {
        if (initialChunksRef.current) {
          initialChunksRef.current.style.display = "none";
        }
        queueMicrotask(() => setInitialChunksMounted(false));
      },
    });

    backdrop.start();

    const updateMotion = () => {
      backdrop.setSpeed(motionPreference.matches ? 0 : 20);
    };
    motionPreference.addEventListener("change", updateMotion);

    return () => {
      motionPreference.removeEventListener("change", updateMotion);
      backdrop.destroy();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        ref={mountRef}
        className="absolute inset-0 opacity-50 transition-[filter] duration-700 dark:invert"
      />
      {initialChunksMounted && (
        <div
          ref={initialChunksRef}
          className="absolute inset-0 flex overflow-hidden opacity-50 transition-[filter] duration-700 dark:invert"
        >
          {INITIAL_CHUNKS.map((index) => (
            <div
              key={index}
              className="relative h-full shrink-0 overflow-hidden"
              style={{ width: `${CHUNK_WIDTH_VH}vh` }}
            >
              <img
                src={`${shanShuiConfig.savedChunkBaseUrl}-${index}.webp`}
                alt=""
                decoding="async"
                fetchPriority={index < 2 ? "high" : "auto"}
                className="absolute top-0 h-full max-w-none"
                style={
                  index === 0 ? FIRST_CHUNK_IMAGE_STYLE : CHUNK_IMAGE_STYLE
                }
              />
            </div>
          ))}
        </div>
      )}
      <div
        className="absolute -inset-x-16 bg-slate-50/88 transition-colors duration-700 sm:inset-x-[clamp(24px,16vw,220px)] dark:bg-black/70"
        style={{
          top: "clamp(72px, 18vh, 160px)",
          bottom: "clamp(72px, 18vh, 160px)",
          borderRadius: "clamp(48px, 8vw, 110px)",
          filter: "blur(clamp(48px, 7vw, 90px))",
        }}
      />
    </div>
  );
}
