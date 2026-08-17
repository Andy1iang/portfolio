import Header from "../Components/Header";
import { PencilRuler } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="grid min-h-dvh grid-rows-[42dvh_minmax(0,1fr)] px-4">
      <div className="flex items-end justify-center">
        <div className="w-full max-w-xl pb-4">
          <Header />
        </div>
      </div>
      <main className="flex flex-col items-center">
        <PencilRuler className="mt-3 h-8 w-8" />
        <h1 className="mt-3 w-full max-w-xl text-center text-xl">W.I.P.</h1>
        <p className="mt-3 w-full max-w-xl text-center text-sm text-slate-500">
          Project Page Coming Soon
        </p>
      </main>
    </div>
  );
}
