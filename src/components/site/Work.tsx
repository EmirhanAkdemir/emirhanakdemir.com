import { useState } from "react";
import type { Dict } from "@/i18n/tr";
import { SectionHead } from "./SectionHead";
import { FeaturedJourney } from "./work/FeaturedJourney";
import { ProjectArchive } from "./work/ProjectArchive";
import { cn } from "@/lib/utils";

export function Work({ t }: { t: Dict }) {
  const [view, setView] = useState<"journey" | "list">("journey");
  return (
    <section id="work" className="py-24 md:py-36">
      <div className="container-grid gap-y-12">
        <SectionHead index="03" label={t.work.label} title={t.work.title} />
        <div role="group" aria-label={t.work.view} className="col-span-12 flex gap-1 md:col-start-4">
          {(["journey", "list"] as const).map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "label-mono border px-4 py-2 transition-colors",
                view === v ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.work[v]}
            </button>
          ))}
        </div>
        {view === "journey" ? <FeaturedJourney t={t} /> : <ProjectArchive t={t} />}
      </div>
    </section>
  );
}
