import type { Dict } from "@/i18n/tr";
import { SectionHead } from "./SectionHead";
export function Expertise({ t }: { t: Dict }) {
  return (
    <section id="expertise" className="bg-card py-24 md:py-36">
      <div className="container-grid gap-y-12">
        <SectionHead index="04" label={t.expertise.label} title={t.expertise.title} />
        <ol className="col-span-12 grid grid-cols-1 border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {t.expertise.items.map((it, i) => (
            <li key={it.t} className="group flex min-h-64 flex-col justify-between border-b border-r border-border p-6 transition-colors hover:bg-background md:p-8">
              <span className="label-mono text-muted-foreground group-hover:text-primary">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl font-medium md:text-3xl">{it.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
