import type { Dict } from "@/i18n/tr";
import type { Locale } from "@/i18n";
import type { PublicProject } from "@/lib/portfolio/model";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: PublicProject;
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
  const services = project.services.map((s) => t.work.portfolioServices[s]).join(" · ");
  const image = project.images.find((m) => m.kind === "cover") ?? project.images[0];
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const frame = (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-border bg-card transition-colors duration-300 group-hover:border-cobalt",
        ratio,
      )}
    >
      {image && failedUrl !== image.url ? <img src={image.url} alt={image.alt[locale] || project.name} loading="lazy" onError={() => setFailedUrl(image.url)} className="absolute inset-0 h-full w-full object-cover" /> : <span aria-hidden className="font-display text-[18vw] font-semibold leading-none text-foreground opacity-[0.07] md:text-[9vw]">
        {num}
      </span>}
      <span className="label-mono absolute left-4 top-4 bg-card/85 text-muted-foreground">{project.industry ? t.work.categories[project.industry as keyof typeof t.work.categories] ?? project.industry : ""}</span>
      <span className="label-mono absolute right-4 top-4 bg-card/85 text-muted-foreground">{project.yearLabel}</span>
    </div>
  );

  return (
    <article className={cn("group col-span-12", className)}>
        <Link to={locale === "tr" ? "/projects/$slug" : "/en/projects/$slug"} params={{ slug: project.slug }} aria-label={`${project.name} — ${t.work.details}`}>
          {frame}
        </Link>
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
