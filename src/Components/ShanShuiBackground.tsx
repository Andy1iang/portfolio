import { useEffect, useRef } from "react";
import { ShanShuiBackdrop } from "../backdrop/ShanShuiBackdrop.js";

export default function ShanShuiBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const backdrop = new ShanShuiBackdrop(mountRef.current, {
      seed: "portfolio",
      speed: motionPreference.matches ? 0 : 20,
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
