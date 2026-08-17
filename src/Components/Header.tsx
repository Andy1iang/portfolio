import { Link } from "react-router-dom";
import DarkModeButton from "./DarkModeButton";

export default function Header() {
  return (
    <header className="w-full">
      <nav className="flex items-center justify-end gap-3 text-sm selection:bg-amber-100 selection:text-amber-500">
        <div className="transition-colors duration-700 hover:text-amber-600">
          <Link to="/">Home</Link>
        </div>
        <div className="transition-colors duration-700 hover:text-amber-600">
          <Link to="/projects">Projects</Link>
        </div>
        <div className="transition-colors duration-700 hover:text-amber-600">
          <Link to="/blog">Blog</Link>
        </div>
        <DarkModeButton />
      </nav>
    </header>
  );
}
