import type { Dict } from "@/i18n/tr";
import type { PublicProject } from "@/lib/portfolio/model";
import { ProjectCard } from "./ProjectCard";

/** Editorial staggered layout for the 8 featured projects.
 *  Span/offset rhythm mirrors the Swiss grid; ratios are tuned per slot so
 *  the composition reads as a journey, not a uniform grid. */
const slots: { ratio: string; span: string }[] = [
  { ratio: "aspect-[16/8]", span: "md:col-span-12" },
  { ratio: "aspect-[4/5]", span: "md:col-span-5" },
  { ratio: "aspect-[4/3]", span: "md:col-span-6 md:col-start-7 md:mt-40" },
  { ratio: "aspect-[16/9]", span: "md:col-span-8 md:col-start-3" },
  { ratio: "aspect-[4/3]", span: "md:col-span-6" },
  { ratio: "aspect-[4/5]", span: "md:col-span-5 md:col-start-8 md:mt-24" },
  { ratio: "aspect-[16/9]", span: "md:col-span-7 md:col-start-2" },
  { ratio: "aspect-[16/8]", span: "md:col-span-10 md:col-start-2" },
];

export function FeaturedJourney({ t, projects }: { t: Dict; projects: PublicProject[] }) {
  return (
    <>
      {projects.map((p, i) => {
        const slot = slots[i % slots.length] ?? { ratio: "aspect-[16/9]", span: "" };
        return <ProjectCard key={p.id} project={p} index={i} t={t} ratio={slot.ratio} className={slot.span} />;
      })}
    </>
  );
}
