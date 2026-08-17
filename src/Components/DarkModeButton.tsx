import { useState } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";

export default function DarkModeButton() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  function handleDarkModeButtonClick() {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");
    root.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative h-4 w-4 cursor-pointer hover:text-amber-600"
      onClick={handleDarkModeButtonClick}
    >
      <Lightbulb
        className={`absolute inset-0 h-4 w-4 transition-all duration-700 ${
          isDark
            ? "scale-75 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <LightbulbOff
        className={`absolute inset-0 h-4 w-4 transition-all duration-700 ${
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-75 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
