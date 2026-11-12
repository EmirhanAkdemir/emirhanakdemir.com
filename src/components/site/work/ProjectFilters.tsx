import type { Dict } from "@/i18n/tr";
import type { PortfolioService } from "@/data/portfolio-services";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  t: Dict;
  services: readonly PortfolioService[];
  active: PortfolioService | null;
  onService: (service: PortfolioService | null) => void;
  query: string;
  onQuery: (q: string) => void;
}

export function ProjectFilters({ t, services, active, onService, query, onQuery }: ProjectFiltersProps) {
  const chip = (on: boolean) =>
    cn(
      "label-mono h-auto whitespace-normal rounded-none border px-3 py-1.5 shadow-none transition-colors",
      on ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-1" role="group" aria-label={t.work.serviceFilter}>
        <Button variant="ghost" aria-pressed={active === null} onClick={() => onService(null)} className={chip(active === null)}>
          {t.work.all}
        </Button>
        {services.map((service) => (
          <Button variant="ghost" key={service} aria-pressed={active === service} onClick={() => onService(active === service ? null : service)} className={chip(active === service)}>
            {t.work.portfolioServices[service]}
          </Button>
        ))}
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={t.work.search}
        aria-label={t.work.search}
        className="label-mono w-full border border-border bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-cobalt focus:outline-none md:w-64"
      />
    </div>
  );
}
