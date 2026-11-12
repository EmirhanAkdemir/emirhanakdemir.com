import { useEffect, useRef } from "react";
import type { Dict } from "@/i18n/tr";
import { Button } from "@/components/ui/button";

const BARS = [10, 22, 14, 30, 18, 36, 12, 26, 16, 32, 20, 8, 24, 14, 28];

export function Hero({ t }: { t: Dict }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        for (const el of layers) {
          const d = Number(el.dataset.depth || 0);
          el.style.transform = `translate3d(${(x * d).toFixed(1)}px, ${(y * d).toFixed(1)}px, 0)`;
        }
      });
    };
    root.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section ref={rootRef} id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-10 pt-24 md:pb-14 md:pt-28">
      {/* faint 12-column hairlines */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="container-grid h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-l border-border/40 last:border-r" />
          ))}
        </div>
      </div>

      <div className="container-grid relative items-center gap-y-10">
        <div className="label-mono col-span-12 flex justify-between text-muted-foreground reveal">
          <span>{t.hero.index}</span>
          <span className="hidden md:inline">41.0082° N, 28.9784° E</span>
          <span>{t.hero.location}</span>
        </div>

        {/* layered name */}
        <div className="relative col-span-12 lg:col-span-8">
          <h1 className="relative text-[16.5vw] font-semibold leading-[0.86] tracking-[-0.055em] sm:text-[15vw] lg:text-[10.5vw] xl:text-[9.5rem]">
            <span
              aria-hidden
              data-depth="16"
              className="pointer-events-none absolute -left-1.5 top-1.5 select-none text-transparent opacity-50 [-webkit-text-stroke:1px_var(--color-cobalt)]"
            >
              Emirhan
              <br />
              <span className="md:ml-[10%]">Akdemir.</span>
            </span>
            <span data-depth="5" className="relative block reveal">
              Emirhan
              <br />
              <span className="md:ml-[10%]">
                Akdemir<span className="text-cobalt">.</span>
              </span>
            </span>
          </h1>
        </div>

        {/* architectural signal composition */}
        <div className="relative col-span-4 hidden lg:block">
          <div data-depth="26" className="relative ml-auto aspect-square w-full max-w-[360px] reveal" style={{ animationDelay: "120ms" }}>
            <svg viewBox="0 0 400 400" fill="none" className="h-full w-full text-foreground/30">
              <rect x="1" y="1" width="398" height="398" stroke="currentColor" strokeOpacity="0.4" />
              <path d="M1 80h398M1 320h398M80 1v398M320 1v398" stroke="currentColor" strokeOpacity="0.18" />
              <circle cx="200" cy="200" r="150" stroke="currentColor" strokeOpacity="0.55" />
              <circle
                cx="200"
                cy="200"
                r="150"
                stroke="var(--color-cobalt)"
                strokeWidth="1.5"
                strokeDasharray="70 872"
                strokeLinecap="round"
                className="origin-center animate-[hero-spin_26s_linear_infinite]"
              />
              <circle cx="200" cy="200" r="96" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="2 7" />
              <path d="M200 36v44M200 320v44M36 200h44M320 200h44" stroke="currentColor" strokeOpacity="0.8" />
              <circle cx="200" cy="200" r="3.5" fill="var(--color-cobalt)" />
              {BARS.map((h, i) => (
                <rect key={i} x={58 + i * 20} y={300 - h} width="3" height={h} fill="currentColor" fillOpacity="0.5" />
              ))}
              <path d="M52 300h296" stroke="currentColor" strokeOpacity="0.5" />
              <rect x="284" y="84" width="10" height="10" fill="var(--color-cobalt)" />
              <path d="M284 104v-10h10" stroke="currentColor" strokeOpacity="0.6" />
            </svg>
            <span className="label-mono absolute left-3 top-3 text-muted-foreground">SIG — 01</span>
            <span className="label-mono absolute bottom-3 right-3 text-muted-foreground">İST / TR</span>
          </div>
        </div>

        {/* positioning row */}
        <div className="col-span-12 grid grid-cols-12 gap-x-5 gap-y-6 border-t border-border pt-7 reveal md:gap-x-6" style={{ animationDelay: "220ms" }}>
          <p className="label-mono col-span-12 text-cobalt md:col-span-3">{t.hero.role}</p>
          <p className="col-span-12 max-w-xl text-lg leading-relaxed text-muted-foreground md:col-span-5 md:text-xl">{t.hero.intro}</p>
          <div className="col-span-12 flex flex-wrap items-start gap-3 md:col-span-4 md:justify-end">
            <Button asChild size="lg" className="group rounded-none bg-cobalt px-7 text-primary-foreground hover:bg-cobalt/90">
              <a href="#work">
                {t.hero.ctaWork}
                <span aria-hidden className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-foreground/30 bg-transparent px-7 transition-colors duration-300 hover:bg-foreground hover:text-background">
              <a href="#contact">{t.hero.ctaContact}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
