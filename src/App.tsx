import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BlogPage from "./Pages/BlogPage";
import ProjectsPage from "./Pages/ProjectsPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 transition-colors duration-700 dark:bg-stone-900 dark:text-slate-200">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
