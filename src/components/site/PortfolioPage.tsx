import { getDict, type Locale } from "@/i18n";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Impact } from "./Impact";
import { About } from "./About";
import { Work } from "./Work";
import { Expertise } from "./Expertise";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

export function PortfolioPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <div lang={locale} className="min-h-screen bg-background text-foreground">
      <Header t={t} locale={locale} mode="home" />
      <main>
        <Hero t={t} />
        <Impact t={t} />
        <About t={t} />
        <Work t={t} />
        <Expertise t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
