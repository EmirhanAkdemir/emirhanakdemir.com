import type { Dict } from "@/i18n/tr";
import type { CategoryKey } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  t: Dict;
  categories: CategoryKey[];
  active: CategoryKey | null;
  onCategory: (c: CategoryKey | null) => void;
  query: string;
  onQuery: (q: string) => void;
}

export function ProjectFilters({ t, categories, active, onCategory, query, onQuery }: ProjectFiltersProps) {
  const chip = (on: boolean) =>
    cn(
      "label-mono border px-3 py-1.5 transition-colors",
      on ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-1" role="group" aria-label={t.work.categories.web}>
        <button aria-pressed={active === null} onClick={() => onCategory(null)} className={chip(active === null)}>
          {t.work.all}
        </button>
        {categories.map((c) => (
          <button key={c} aria-pressed={active === c} onClick={() => onCategory(active === c ? null : c)} className={chip(active === c)}>
            {t.work.categories[c]}
          </button>
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
