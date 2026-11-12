import type { Dict } from "@/i18n/tr";
export function Impact({ t }: { t: Dict }) {
  return (
    <section aria-labelledby="impact-h" className="bg-ivory py-20 text-ivory-foreground md:py-28">
      <div className="container-grid gap-y-10">
        <div className="col-span-12 flex items-end justify-between border-t border-current/20 pt-6">
          <p className="label-mono"><span className="text-primary">01</span> / {t.impact.label}</p>
          <h2 id="impact-h" className="sr-only">{t.impact.title}</h2>
          <p className="label-mono opacity-60">{t.impact.note}</p>
        </div>
        {t.impact.items.map((it, i) => (
          <div key={it.k} className="col-span-12 border-t border-current/15 pt-6 md:col-span-4">
            <p className="label-mono opacity-60">0{i + 1}</p>
            <p className="mt-8 font-display text-6xl font-medium tracking-tight opacity-35 md:text-7xl">{it.v}</p>
            <p className="mt-4 text-base">{it.k}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
