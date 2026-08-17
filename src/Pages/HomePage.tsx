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

            <hr className="mt-3 rounded-full border-black/10 dark:border-white/10" />
            <footer className="mt-3 flex justify-start gap-1 text-sm">
              <div className="transition-colors duration-700 hover:text-amber-600">
                <a
                  href="https://www.linkedin.com/in/yanhang-liang/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Linkedin
                </a>
              </div>
              ❘
              <div className="transition-colors duration-700 hover:text-amber-600">
                <a
                  href="https://github.com/andy1iang"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </div>
              <div className="ml-auto transition-colors duration-700 hover:text-amber-600">
                <a
                  href="https://letterboxd.com/DonLotto/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Letterboxd
                </a>
              </div>
              ❘
              <div className="transition-colors duration-700 hover:text-amber-600">
                <a
                  href="https://www.goodreads.com/user/show/184664624-andy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Goodreads
                </a>
              </div>
              ❘
              <div className="transition-colors duration-700 hover:text-amber-600">
                <a
                  href="https://boardgamegeek.com/profile/DonLotto/"
                  target="_blank"
                  rel="noreferrer"
                >
                  BGG
                </a>
              </div>
            </footer>
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
    if (hour < 23) return "Good evening";
    return "Hello";
  } catch {
    return "Hello";
  }
}
