import { Sailboat } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-dvh grid-rows-[42dvh_minmax(0,1fr)] px-4 select-none">
      <div className="flex items-end justify-center"></div>
      <main className="flex flex-col items-center">
        <Sailboat className="mt-3 h-8 w-8" />
        <p className="mt-3 w-full max-w-xl text-center text-xl">
          Hey matey, ye sailed off course!
        </p>
        <Link
          to="/"
          className="mt-4 rounded-md border-2 border-slate-300 px-4 py-2 text-sm font-medium transition-colors duration-700 hover:border-amber-500 hover:text-amber-600 dark:border-stone-600"
        >
          Return to shore
        </Link>
      </main>
    </div>
  );
}
