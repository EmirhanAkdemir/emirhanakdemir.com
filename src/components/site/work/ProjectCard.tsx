import type { Dict } from "@/i18n/tr";
import type { Locale } from "@/i18n";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
  t: Dict;
  ratio?: string;
  className?: string;
}

/** Editorial card for the featured journey. Structured so a future
 *  scroll-linked perspective layer can wrap the frame without refactors. */
export function ProjectCard({ project, index, t, ratio = "aspect-[16/9]", className }: ProjectCardProps) {
  const locale = t.locale as Locale;
  const num = String(index + 1).padStart(2, "0");
  const services = project.services.map((s) => t.work.services[s]).join(" · ");

  const frame = (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-border bg-card transition-colors duration-300 group-hover:border-cobalt",
        ratio,
      )}
    >
      <span aria-hidden className="font-display text-[18vw] font-semibold leading-none text-foreground opacity-[0.07] md:text-[9vw]">
        {num}
      </span>
      <span className="label-mono absolute left-4 top-4 text-muted-foreground">{t.work.categories[project.category]}</span>
      <span className="label-mono absolute right-4 top-4 text-muted-foreground">{project.yearLabel}</span>
    </div>
  );

  return (
    <article className={cn("group col-span-12", className)}>
      {project.externalUrl ? (
        <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.work.visit}`}>
          {frame}
        </a>
      ) : (
        frame
      )}
      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4">
        <h3 className="text-xl font-medium md:text-2xl">{project.name}</h3>
        <p className="label-mono shrink-0 text-right text-muted-foreground">
          {project.contextPending ? t.work.pending : project.context}
        </p>
      </div>
      <p className="label-mono mt-2 text-muted-foreground">{services}</p>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">{project.description[locale]}</p>
    </article>
  );
}
