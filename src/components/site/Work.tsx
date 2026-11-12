import { useState } from "react";
import type { Dict } from "@/i18n/tr";
import { SectionHead } from "./SectionHead";
import { cn } from "@/lib/utils";

const projects = [
  { n: "01", cat: "Growth / Google Ads", year: "20XX", ratio: "aspect-[16/8]", span: "md:col-span-12" },
  { n: "02", cat: "Web Design", year: "20XX", ratio: "aspect-[4/5]", span: "md:col-span-5" },
  { n: "03", cat: "Automation", year: "20XX", ratio: "aspect-[4/3]", span: "md:col-span-6 md:col-start-7 md:mt-40" },
  { n: "04", cat: "Custom Software", year: "20XX", ratio: "aspect-[16/9]", span: "md:col-span-8 md:col-start-3" },
];

export function Work({ t }: { t: Dict }) {
  const [view, setView] = useState<"journey" | "list">("journey");
  return (
    <section id="work" className="py-24 md:py-36">
      <div className="container-grid gap-y-12">
        <SectionHead index="03" label={t.work.label} title={t.work.title} />
        <div role="group" aria-label="View" className="col-span-12 flex gap-1 md:col-start-4">
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
        {view === "journey" ? (
          projects.map((p) => (
            <article key={p.n} className={cn("group col-span-12", p.span)}>
              <div className={cn("placeholder-frame relative flex items-center justify-center overflow-hidden bg-card text-muted-foreground transition-colors group-hover:border-primary", p.ratio)}>
                <span className="font-display text-[18vw] font-semibold leading-none opacity-10 md:text-[10vw]">{p.n}</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4">
                <h3 className="text-xl font-medium md:text-2xl">[{t.work.placeholder} {p.n}]</h3>
                <p className="label-mono shrink-0 text-muted-foreground">{p.cat} — {p.year}</p>
              </div>
            </article>
          ))
        ) : (
          <ul className="col-span-12 border-b border-border">
            {projects.map((p) => (
              <li key={p.n} className="group grid grid-cols-12 items-baseline gap-x-6 border-t border-border py-6 transition-colors hover:text-primary">
                <span className="label-mono col-span-2 text-muted-foreground md:col-span-1">{p.n}</span>
                <span className="col-span-10 font-display text-2xl md:col-span-6 md:text-4xl">[{t.work.placeholder} {p.n}]</span>
                <span className="label-mono col-span-6 col-start-3 mt-2 text-muted-foreground md:col-span-3 md:col-start-auto md:mt-0">{p.cat}</span>
                <span className="label-mono col-span-4 mt-2 text-right text-muted-foreground md:col-span-2 md:mt-0">{p.year} →</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
