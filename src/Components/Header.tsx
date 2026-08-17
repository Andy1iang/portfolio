import { Link } from "react-router-dom";
import DarkModeButton from "./DarkModeButton";

export default function Header() {
  return (
    <header className="w-full">
      <nav className="flex items-center justify-end gap-3 text-sm selection:bg-amber-100 selection:text-amber-500">
        <Link
          to="/"
          className="text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-600"
        >
          Home
        </Link>
        <Link
          to="/projects"
          className="text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-600"
        >
          Projects
        </Link>
        <Link
          to="/blog"
          className="text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-600"
        >
          Blog
        </Link>
        <DarkModeButton />
      </nav>
    </header>
  );
}
