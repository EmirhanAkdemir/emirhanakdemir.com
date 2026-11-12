import { Link } from "@tanstack/react-router";
import { getDict, paths, type Locale } from "@/i18n";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SectionHead } from "./SectionHead";
import { InquiryForm } from "./InquiryForm";
import { Button } from "@/components/ui/button";

export function DjPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const d = t.dj;
  return (
    <div lang={locale} className="dj min-h-screen bg-background text-foreground">
      <Header t={t} locale={locale} mode="dj" />
      <main>
        <section id="top" className="flex min-h-[100svh] flex-col justify-end pb-12 pt-28 md:pb-16">
          <div className="container-grid gap-y-8">
            <p className="label-mono col-span-12 text-primary reveal">{d.index} — Emirhan Akdemir</p>
            <h1 className="col-span-12 text-[16vw] font-semibold leading-[0.86] tracking-[-0.06em] reveal md:col-span-10 md:text-[10vw] 2xl:text-[10rem]">
              {d.title}
            </h1>
            <div className="col-span-12 grid grid-cols-12 gap-x-6 gap-y-6 border-t border-border pt-8">
              <p className="col-span-12 text-lg text-muted-foreground md:col-span-6 md:col-start-4">{d.intro}</p>
              <div className="col-span-12 flex flex-wrap gap-3 md:col-span-3 md:justify-end">
                <Button asChild size="lg" className="rounded-none px-7"><a href="#sets">{d.ctaSets}</a></Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-foreground/30 bg-transparent px-7 hover:bg-foreground hover:text-background"><a href="#booking">{d.ctaBook}</a></Button>
              </div>
            </div>
          </div>
        </section>
        <section id="sets" className="py-24 md:py-32">
          <div className="container-grid gap-y-12">
            <SectionHead index="01" label={d.setsLabel} title={d.setsTitle} />
            <ul className="col-span-12 border-b border-border">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="grid grid-cols-12 items-center gap-x-6 border-t border-border py-6">
                  <span className="label-mono col-span-2 text-primary md:col-span-1">0{n}</span>
                  <span className="col-span-10 font-display text-2xl md:col-span-5 md:text-3xl">[{d.set} 0{n}]</span>
                  <span className="label-mono col-span-6 col-start-3 mt-2 text-muted-foreground md:col-span-2 md:col-start-auto md:mt-0">[Genre] · [BPM]</span>
                  <span className="label-mono col-span-4 mt-2 text-right text-muted-foreground md:col-span-2 md:mt-0">[00:00:00]</span>
                  <span className="label-mono col-span-12 mt-3 text-right text-muted-foreground md:col-span-2 md:mt-0">{d.soon}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="booking" className="py-24 md:py-32">
          <div className="container-grid gap-y-12">
            <SectionHead index="02" label={d.bookLabel} title={d.bookTitle} />
            <div className="col-span-12 md:col-span-3">
              <Link to={paths[locale].home} className="label-mono text-muted-foreground hover:text-primary">← {d.back}</Link>
            </div>
            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <InquiryForm
                submit={t.contact.send}
                demo={t.contact.demo}
                fields={[
                  { id: "dj-name", label: t.contact.name },
                  { id: "dj-email", label: t.contact.email, type: "email" },
                  { id: "dj-date", label: d.date, type: "date" },
                  { id: "dj-venue", label: d.venue },
                  { id: "dj-type", label: d.type, full: true },
                  { id: "dj-message", label: t.contact.message, textarea: true },
                ]}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer t={t} />
    </div>
  );
}
