import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import type { Dict } from "@/i18n/tr";
import type { Locale } from "@/i18n";
import { portfolioServices } from "@/data/portfolio-services";
import { filterPublicProjects, validateWorkSearch, type PublicProject } from "@/lib/portfolio/model";
import { ProjectFilters } from "./ProjectFilters";

/** Full archive: all records, confirmed service filtering and search.
 *  Works without any animation; rows link out only when a real URL exists. */
export function ProjectArchive({ t, projects }: { t: Dict; projects: PublicProject[] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const search = validateWorkSearch(location.search);
  const service = search.service;
  const query = search.q;
  const update = (next: typeof search) => void navigate({ to: t.locale === "tr" ? "/" : "/en", search: next, hash: "work", resetScroll: false, replace: true });

  const filtered = useMemo(() => {
    return filterPublicProjects(projects, service, query, t.locale as Locale, t.work.portfolioServices);
  }, [projects, service, query, t]);

  return (
    <div className="col-span-12 flex flex-col gap-8">
      <ProjectFilters
        t={t}
        services={portfolioServices}
        active={service ?? null}
        onService={(value) => update({ ...search, service: value ?? undefined })}
        query={query}
        onQuery={(value) => update({ ...search, q: value })}
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
                  <Link to={t.locale === "tr" ? "/projects/$slug" : "/en/projects/$slug"} params={{ slug: p.slug }} className="underline-offset-4 hover:underline">
                    {p.name}
                  </Link>
              </span>
              <span className="label-mono col-span-6 col-start-3 mt-2 text-muted-foreground md:col-span-3 md:col-start-auto md:mt-0">
                {p.industry && `${t.work.categories[p.industry as keyof typeof t.work.categories] ?? p.industry} — `}{p.contextPending ? t.work.pending : p.context}
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
