import type { Dict } from "@/i18n/tr";
import { SectionHead } from "./SectionHead";
export function About({ t }: { t: Dict }) {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="container-grid gap-y-12">
        <SectionHead index="02" label={t.about.label} title={t.about.title} />
        <div className="placeholder-frame col-span-12 flex aspect-[4/5] items-end p-5 text-muted-foreground md:col-span-5 md:col-start-1">
          <span className="label-mono">[{t.about.photo}] — 4:5</span>
        </div>
        <div className="col-span-12 flex flex-col justify-end gap-6 md:col-span-5 md:col-start-8">
          {t.about.body.map((p, i) => (
            <p key={i} className={i === 0 ? "text-xl leading-relaxed md:text-2xl" : "leading-relaxed text-muted-foreground"}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
