import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App.tsx";

try {
  document.documentElement.classList.toggle(
    "dark",
    localStorage.getItem("theme") === "dark",
  );
} catch {
  // Use the default light theme if browser storage is unavailable.
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
