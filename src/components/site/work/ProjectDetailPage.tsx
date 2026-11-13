import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getDict, type Locale } from "@/i18n";
import { publicPortfolioQuery } from "@/lib/portfolio/queries";
import type { PublicProject } from "@/lib/portfolio/model";
import { Button } from "@/components/ui/button";
import { PortfolioRouteState } from "./PortfolioRouteState";

export function ProjectDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const { data } = useSuspenseQuery(publicPortfolioQuery());
  const t = getDict(locale);
  const project = data.projects.find((p) => p.slug === slug);
  if (data.error) return <PortfolioRouteState locale={locale} state="error" />;
  if (!project) return <PortfolioRouteState locale={locale} state="notFound" />;
  return <main lang={locale} className="min-h-screen bg-background py-12 text-foreground md:py-20">
    <div className="container-grid gap-y-10">
      <div className="col-span-12 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <Button asChild variant="link" className="label-mono h-auto p-0"><Link to={locale === "tr" ? "/" : "/en"} hash="work">← {t.work.back}</Link></Button>
        <Button asChild variant="link" className="label-mono h-auto p-0"><Link to={locale === "tr" ? "/en/projects/$slug" : "/projects/$slug"} params={{ slug }}>TR / EN</Link></Button>
      </div>
      <div className="col-span-12 md:col-span-9">
        <p className="label-mono mb-5 text-muted-foreground">{project.contextPending ? t.work.pending : project.context} · {project.yearLabel}</p>
        <h1 className="break-words font-display text-4xl md:text-6xl">{project.name}</h1>
        <p className="label-mono mt-6 text-primary">{project.services.map((s) => t.work.portfolioServices[s]).join(" · ")}</p>
        <p className="mt-8 max-w-prose whitespace-pre-line text-lg text-muted-foreground">{project.description[locale]}</p>
        {project.externalUrl && <Button asChild variant="link" className="mt-6 px-0"><a href={project.externalUrl} target="_blank" rel="noopener noreferrer">{t.work.visit} ↗</a></Button>}
      </div>
      {project.images.map((image) => <figure key={image.id} className="col-span-12">
        <img src={image.url} alt={image.alt[locale] || project.name} className="h-auto w-full" />
      </figure>)}
      {project.responsibilities.length > 0 && <section className="col-span-12 border-t border-border pt-8">
        <h2 className="label-mono mb-4">{t.work.responsibilities}</h2>
        <ul className="space-y-2 text-muted-foreground">{project.responsibilities.map((s, i) => <li key={`${s}-${i}`}>{t.work.services[s as keyof typeof t.work.services] ?? s}</li>)}</ul>
      </section>}
    </div>
  </main>;
}

export function projectDetailHead(project: PublicProject | undefined, locale: Locale) {
  const t = getDict(locale);
  const seo = project?.seo[locale];
  const title = seo?.title || `${project?.name ?? t.work.notFound} — Emirhan Akdemir`;
  const description = seo?.description || project?.description[locale] || t.meta.description;
  const cover = project?.images.find((m) => m.kind === "cover") ?? project?.images[0];
  return { meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: seo?.ogTitle || title },
    { property: "og:description", content: seo?.ogDescription || description },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(cover?.url.startsWith("https://") ? [{ property: "og:image", content: cover.url }, { name: "twitter:image", content: cover.url }] : []),
  ] };
}