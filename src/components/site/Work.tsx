import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { publicPortfolioQuery } from "@/lib/portfolio/queries";
import { validateWorkSearch } from "@/lib/portfolio/model";
import type { Dict } from "@/i18n/tr";
import { SectionHead } from "./SectionHead";
import { FeaturedJourney } from "./work/FeaturedJourney";
import { ProjectArchive } from "./work/ProjectArchive";
import { cn } from "@/lib/utils";

export function Work({ t }: { t: Dict }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = validateWorkSearch(location.search);
  const { data, isFetching } = useSuspenseQuery(publicPortfolioQuery());
  const publicDict = { ...t, work: { ...t.work, portfolioServices: {
    ...t.work.portfolioServices,
    ...Object.fromEntries(data.services.map((s) => [s.id, t.locale === "tr" ? s.tr : s.en])),
  } } };
  const view = search.view;
  const featured = data.projects.filter((p) => p.featured);
  return (
    <section id="work" className="py-24 md:py-36">
      <div className="container-grid gap-y-12">
        <SectionHead index="03" label={t.work.label} title={t.work.title} />
        <div role="group" aria-label={t.work.view} className="col-span-12 flex gap-1 md:col-start-4">
          {(["journey", "list"] as const).map((v) => (
            <Button
              variant="ghost"
              key={v}
              aria-pressed={view === v}
              onClick={() => void navigate({ to: t.locale === "tr" ? "/" : "/en", search: { ...search, view: v }, hash: "work", resetScroll: false })}
              className={cn(
                "label-mono h-auto rounded-none border px-4 py-2 shadow-none transition-colors",
                view === v ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.work[v]}
            </Button>
          ))}
        </div>
        {data.error ? (
          <div className="col-span-12 border-t border-border py-12" role="alert">
            <p className="text-muted-foreground">{t.work.loadError}</p>
            <Button variant="outline" className="mt-4 rounded-none" disabled={isFetching} onClick={() => void queryClient.refetchQueries({ queryKey: ["public-portfolio"] })}>{t.work.retry}</Button>
          </div>
        ) : view === "journey" ? (
          featured.length ? <FeaturedJourney t={publicDict} projects={featured} /> : <p className="col-span-12 text-muted-foreground">{t.work.empty}</p>
        ) : <ProjectArchive t={publicDict} projects={data.projects} />}
        {data.imageError && <p className="col-span-12 text-sm text-muted-foreground" role="status">{t.work.imageError}</p>}
      </div>
    </section>
  );
}
