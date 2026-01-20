import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import avatar from "../assets/p1.jpg";

// TODO: Dark Mode + Dark Mode Toggle Button from Settings (FramerMotion)
// TODO: Actually about me content (typing animation for interests)

export default function HomePage() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex max-w-xl flex-col text-left selection:bg-amber-100 selection:text-amber-500">
          {/* everything should be below here */}

          {/* top nav bar */}
          <div className="text-md">
            <nav className="mb-8 flex items-center justify-end gap-3">
              <div className="transition-colors duration-700 hover:text-amber-600">
                <Link to="/projects">Projects</Link>
              </div>
              <div className="transition-colors duration-700 hover:text-amber-600">
                <Link to="/blog">Blog</Link>
              </div>
              <Settings className="h-4 w-4 transition-colors duration-700 hover:text-amber-600" />
            </nav>
          </div>

          {/* body content */}
          {/* avatar */}

          <div className="text-lg">
            <div className="flex items-center gap-4">
              <motion.img
                src={avatar}
                layoutId="avatar"
                className={`h-16 w-16 cursor-pointer rounded-full object-cover ${
                  isImageOpen ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => setIsImageOpen(true)}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 25,
                }}
              />
              <p className="font-['Source_Serif_4',serif] text-xl font-semibold">
                Andy Liang
              </p>
            </div>
            <div className="mt-4 hyphens-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>

          {/* footer */}
          <hr className="mt-3 rounded-full border-black/10 dark:border-white/10" />
          <div className="mt-3 flex justify-start gap-1 text-sm">
            <a
              href="https://www.linkedin.com/in/yanhang-liang/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-700 hover:text-amber-600"
            >
              Linkedin
            </a>
            ❘
            <a
              href="https://github.com/andy1iang"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-700 hover:text-amber-600"
            >
              Github
            </a>
            <a
              href="https://letterboxd.com/DonLotto/"
              target="_blank"
              rel="noreferrer"
              className="ml-auto transition-colors duration-700 hover:text-amber-600"
            >
              Letterboxd
            </a>
            ❘
            <a
              href="https://www.goodreads.com/user/show/184664624-andy"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-700 hover:text-amber-600"
            >
              Goodreads
            </a>
            ❘
            <a
              href="https://boardgamegeek.com/profile/DonLotto/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-700 hover:text-amber-600"
            >
              BGG
            </a>
          </div>
          {/* everything should be above here */}
        </div>
      </div>
      {/* Image Modal - Place it here, outside the main content */}
      <>
        {/* Avatar thumbnail */}
        <AnimatePresence>
          {isImageOpen && (
            <motion.div
              className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { delay: 0.08, duration: 0.35, ease: "easeOut" },
              }}
              onClick={() => setIsImageOpen(false)}
            >
              <motion.img
                src={avatar}
                layoutId="avatar"
                className="max-h-[55vh] max-w-[55vw] rounded-full object-cover"
                onClick={(e) => e.stopPropagation()}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 25,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </>
  );
}
