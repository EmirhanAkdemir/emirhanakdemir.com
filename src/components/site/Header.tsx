import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Dict } from "@/i18n/tr";
import { paths, type Locale } from "@/i18n";

export function Header({ t, locale, mode }: { t: Dict; locale: Locale; mode: "home" | "dj" }) {
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "tr" ? "en" : "tr";
  const home = paths[locale].home;
  const links =
    mode === "home"
      ? [
          { href: "#work", label: t.nav.work },
          { href: "#about", label: t.nav.about },
          { href: "#expertise", label: t.nav.expertise },
          { href: "#contact", label: t.nav.contact },
        ]
      : [
          { href: "#sets", label: t.dj.setsLabel },
          { href: "#booking", label: t.dj.bookLabel },
        ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-grid h-16 items-center">
        <Link to={home} className="col-span-6 font-display text-base font-semibold tracking-tight md:col-span-3">
          Emirhan Akdemir<span className="text-primary">.</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:col-span-6 md:flex md:gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="col-span-6 flex items-center justify-end gap-5 md:col-span-3">
          <Link
            to={mode === "home" ? paths[locale].dj : home}
            className="label-mono hidden text-primary hover:underline sm:inline"
          >
            {mode === "home" ? t.nav.dj : t.nav.portfolio}
          </Link>
          <Link
            to={paths[other][mode]}
            className="label-mono text-foreground hover:text-primary"
            aria-label={other === "en" ? "Switch to English" : "Türkçe'ye geç"}
          >
            <span className={locale === "tr" ? "text-foreground" : "text-muted-foreground"}>TR</span>
            <span className="text-muted-foreground"> / </span>
            <span className={locale === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
          </Link>
          <button
            className="label-mono md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-background md:hidden">
          <ul className="flex flex-col px-5 py-6">
            {[...links, { href: mode === "home" ? paths[locale].dj : home, label: mode === "home" ? t.nav.dj : t.nav.portfolio }].map((l, i) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-3 font-display text-3xl">
                  <span className="label-mono text-primary">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
