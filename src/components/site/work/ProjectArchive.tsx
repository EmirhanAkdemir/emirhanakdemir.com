import { useMemo, useState } from "react";
import type { Dict } from "@/i18n/tr";
import type { Locale } from "@/i18n";
import { projects, type Project } from "@/data/projects";
import { portfolioServices, servicesForProject, filterPortfolioProjects, type PortfolioService } from "@/data/portfolio-services";
import { ProjectFilters } from "./ProjectFilters";

function describe(p: Project, t: Dict): string {
  return [
    p.name,
    p.context,
    p.yearLabel,
    t.work.categories[p.category],
    ...p.services.map((s) => t.work.services[s]),
    ...servicesForProject(p).map((s) => t.work.portfolioServices[s]),
    p.description[t.locale as Locale],
  ]
    .join(" ");
}

/** Full archive: all records, confirmed service filtering and search.
 *  Works without any animation; rows link out only when a real URL exists. */
export function ProjectArchive({ t }: { t: Dict }) {
  const [service, setService] = useState<PortfolioService | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return filterPortfolioProjects(projects, service, query, (p) => describe(p, t));
  }, [service, query, t]);

  return (
    <div className="col-span-12 flex flex-col gap-8">
      <ProjectFilters
        t={t}
        services={portfolioServices}
        active={service}
        onService={setService}
        query={query}
        onQuery={setQuery}
      />
      <p className="label-mono text-muted-foreground" aria-live="polite">
        {t.work.count(filtered.length)}
      </p>
      {filtered.length === 0 ? (
        <p className="border-t border-border py-12 text-muted-foreground">{t.work.noResults}</p>
      ) : (
        <ul className="border-b border-border">
          {filtered.map((p, i) => (
            <li
              key={p.id}
              className="group grid grid-cols-12 items-baseline gap-x-6 border-t border-border py-6 transition-colors hover:text-cobalt"
            >
              <span className="label-mono col-span-2 text-muted-foreground md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-10 font-display text-2xl md:col-span-5 md:text-3xl">
                {p.externalUrl ? (
                  <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </span>
              <span className="label-mono col-span-6 col-start-3 mt-2 text-muted-foreground md:col-span-3 md:col-start-auto md:mt-0">
                {t.work.categories[p.category]} — {p.contextPending ? t.work.pending : p.context}
              </span>
              <span className="label-mono col-span-4 mt-2 text-right text-muted-foreground md:col-span-3 md:mt-0">
                {p.yearLabel}
                {p.externalUrl ? " →" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
