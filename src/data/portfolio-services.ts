import type { Project, ServiceKey } from "./projects";

export const portfolioServices = [
  "website", "googleAds", "metaAds", "seo", "automation", "customSoftware",
] as const;
export type PortfolioService = (typeof portfolioServices)[number];

// Normalize only confirmed activities. Keep all original assignments and
// responsibilities in the source dataset and database; never infer SEO or automation.
export const confirmedServiceMap: Partial<Record<ServiceKey, PortfolioService>> = {
  webDev: "website",
  webflow: "website",
  googleAds: "googleAds",
  metaAds: "metaAds",
  igAds: "metaAds",
  platform: "customSoftware",
};

export function servicesForProject(project: Pick<Project, "services">): PortfolioService[] {
  return Array.from(new Set(project.services.flatMap((key) => {
    const service = confirmedServiceMap[key];
    return service ? [service] : [];
  })));
}

export function filterPortfolioProjects(projects: Project[], service: PortfolioService | null, query: string, describe: (project: Project) => string): Project[] {
  const normalized = query.trim().toLocaleLowerCase();
  return projects.filter((project) =>
    (!service || servicesForProject(project).includes(service)) &&
    (!normalized || describe(project).toLocaleLowerCase().includes(normalized)),
  );
}