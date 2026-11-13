import { Link, useRouter } from "@tanstack/react-router";
import { getDict, type Locale } from "@/i18n";
import { Button } from "@/components/ui/button";

export function PortfolioRouteState({ locale, state }: { locale: Locale; state: "loading" | "error" | "notFound" }) {
  const t = getDict(locale);
  const router = useRouter();
  return <main className="min-h-screen bg-background px-6 py-32 text-foreground">
    <div className="mx-auto max-w-prose" role={state === "error" ? "alert" : "status"}>
      <p className="label-mono mb-6 text-primary">Emirhan Akdemir</p>
      <p>{state === "loading" ? t.work.loading : state === "error" ? t.work.loadError : t.work.notFound}</p>
      {state === "error" && <Button variant="outline" className="mt-6 rounded-none" onClick={() => void router.invalidate()}>{t.work.retry}</Button>}
      {state === "notFound" && <Button asChild variant="link" className="mt-6"><Link to={locale === "tr" ? "/" : "/en"}>{t.work.back}</Link></Button>}
    </div>
  </main>;
}