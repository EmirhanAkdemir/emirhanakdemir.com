import type { Dict } from "@/i18n/tr";
import { Button } from "@/components/ui/button";

export function Hero({ t }: { t: Dict }) {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end pb-12 pt-28 md:pb-16">
      <div className="container-grid gap-y-8">
        <div className="label-mono col-span-12 flex justify-between text-muted-foreground reveal">
          <span>{t.hero.index}</span>
          <span className="hidden md:inline">41.0082° N, 28.9784° E</span>
          <span>{t.hero.location}</span>
        </div>
        <h1 className="col-span-12 text-[19vw] font-semibold leading-[0.84] tracking-[-0.06em] reveal md:text-[13.5vw] 2xl:text-[12rem]">
          Emirhan
          <br />
          <span className="md:ml-[16%]">Akdemir<span className="text-primary">.</span></span>
        </h1>
        <div className="col-span-12 grid grid-cols-12 gap-x-5 gap-y-6 border-t border-border pt-8 reveal md:gap-x-6" style={{ animationDelay: "150ms" }}>
          <p className="label-mono col-span-12 text-primary md:col-span-3">{t.hero.role}</p>
          <p className="col-span-12 max-w-xl text-lg leading-relaxed text-muted-foreground md:col-span-5 md:text-xl">{t.hero.intro}</p>
          <div className="col-span-12 flex flex-wrap items-start gap-3 md:col-span-4 md:justify-end">
            <Button asChild size="lg" className="rounded-none px-7">
              <a href="#work">{t.hero.ctaWork} →</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-foreground/30 bg-transparent px-7 hover:bg-foreground hover:text-background">
              <a href="#contact">{t.hero.ctaContact}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
