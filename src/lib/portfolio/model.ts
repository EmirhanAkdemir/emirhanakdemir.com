import { z } from "zod";
import { portfolioServices, type PortfolioService } from "@/data/portfolio-services";

export interface PublicImage {
  id: string;
  url: string;
  alt: { tr: string; en: string };
  kind: string;
}
export interface PublicProject {
  id: string;
  slug: string;
  name: string;
  context: string;
  contextPending: boolean;
  industry: string | null;
  yearLabel: string;
  featured: boolean;
  displayOrder: number;
  services: PortfolioService[];
  activities: string[];
  responsibilities: string[];
  externalUrl: string | null;
  description: { tr: string; en: string };
  seo: Record<"tr" | "en", { title: string | null; description: string | null; ogTitle: string | null; ogDescription: string | null }>;
  images: PublicImage[];
}

export const workSearchSchema = z.object({
  view: z.enum(["journey", "list"]).catch("journey"),
  service: z.enum(portfolioServices).optional().catch(undefined),
  q: z.string().catch(""),
});
export type WorkSearch = z.infer<typeof workSearchSchema>;
export function validateWorkSearch(input: unknown): WorkSearch {
  return workSearchSchema.parse(input);
}
export function validatePortfolioSearch(input: unknown): Partial<WorkSearch> {
  return validateWorkSearch(input);
}
export function publishedInOrder<T extends { status: string; display_order: number; id: string }>(rows: T[]): T[] {
  return rows.filter((p) => p.status === "published")
    .sort((a, b) => a.display_order - b.display_order || a.id.localeCompare(b.id));
}
export function visibleMedia<T extends { project_id: string; storage_path: string; published: boolean }>(rows: T[], ids: Set<string>): T[] {
  return rows.filter((m) => m.published && ids.has(m.project_id) && m.storage_path.startsWith(`${m.project_id}/`));
}
export function filterPublicProjects(projects: PublicProject[], service: PortfolioService | undefined, query: string, locale: "tr" | "en", labels: Record<PortfolioService, string>) {
  const normalized = query.trim().toLocaleLowerCase(locale);
  return projects.filter((p) => (!service || p.services.includes(service)) &&
    (!normalized || [p.name, p.context, p.yearLabel, p.industry ?? "", p.description[locale],
      ...p.services.map((s) => labels[s]), ...p.activities, ...p.responsibilities].join(" ").toLocaleLowerCase(locale).includes(normalized)));
}