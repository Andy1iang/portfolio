import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import avatar from "../assets/p1.jpg";
import Header from "../Components/Header";

export default function HomePage() {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const greeting = useMemo(() => getTimeBasedGreeting(new Date()), []);

  return (
    <>
      <div className="grid min-h-dvh grid-rows-[42dvh_minmax(0,1fr)] px-4">
        <div className="flex items-end justify-center">
          <div className="w-full max-w-xl pb-4">
            <Header />
          </div>
        </div>

        <main className="flex justify-center">
          <div className="w-full max-w-xl text-left selection:bg-amber-100 selection:text-amber-500">
            <div className="text-base">
              <div className="flex items-center gap-4">
                <motion.img
                  src={avatar}
                  layoutId="avatar"
                  className={`h-16 w-16 cursor-pointer rounded-full object-cover select-none ${
                    isImageOpen ? "opacity-0" : "opacity-100"
                  }`}
                  onClick={() => setIsImageOpen(true)}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 25,
                  }}
                />
                <p className="font-['Source_Serif_4',serif] text-lg font-semibold">
                  Andy Liang
                </p>
              </div>
              <p className="mt-4 hyphens-auto">
                {greeting}! Poke around and see if anything here interests you.
                Feel free to reach out for any reason.
              </p>
            </div>

            <hr className="mt-3 rounded-full border-black/10 transition-colors duration-700 dark:border-white/10" />
            <footer className="mt-3 flex justify-start gap-1 text-sm">
              <a
                href="https://www.linkedin.com/in/yanhang-liang/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200"
              >
                Linkedin
              </a>
              ❘
              <a
                href="https://github.com/andy1iang"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200"
              >
                Github
              </a>
              <a
                href="https://letterboxd.com/DonLotto/"
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200"
              >
                Letterboxd
              </a>
              ❘
              <a
                href="https://www.goodreads.com/user/show/184664624-andy"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200"
              >
                Goodreads
              </a>
              ❘
              <a
                href="https://boardgamegeek.com/profile/DonLotto/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 transition-colors duration-700 hover:text-amber-600 dark:text-slate-200"
              >
                BGG
              </a>
            </footer>

            <blockquote className="mt-8 border-l-2 border-slate-300 bg-slate-100 py-2 pl-4 text-xs text-slate-500 italic transition-colors duration-700 dark:border-stone-600 dark:bg-stone-800 dark:text-slate-400">
              <p>
                I am the master of my fate,
                <br />
                &emsp;I am the captain of my soul.
              </p>
              <cite className="mt-2 block text-xs not-italic">
                — From William Ernest Henley's{" "}
                <a
                  href="https://www.poetryfoundation.org/poems/51642/invictus"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 italic underline transition-colors duration-700 hover:text-amber-600 dark:text-slate-400"
                >
                  Invictus
                </a>
              </cite>
            </blockquote>
          </div>
        </main>
      </div>

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
              className="max-h-[55vh] max-w-[55vw] rounded-full object-cover select-none"
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
  );
}

function getTimeBasedGreeting(date: Date): string {
  try {
    const hour = date.getHours();

    if (Number.isNaN(hour)) {
      return "Hello";
    }

    if (hour < 5) return "Hey night owl";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    if (hour < 24) return "Good evening";
    return "Hello";
  } catch {
    return "Hello";
  }
}
