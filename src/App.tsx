import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShanShuiBackground from "./Components/ShanShuiBackground";
import HomePage from "./Pages/HomePage";
import BlogPage from "./Pages/BlogPage";
import ProjectsPage from "./Pages/ProjectsPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-slate-50 text-slate-700 transition-colors duration-700 dark:bg-stone-900 dark:text-slate-200">
      <ShanShuiBackground />
      <div className="relative z-10">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
