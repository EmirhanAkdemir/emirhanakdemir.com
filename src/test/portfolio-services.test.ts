import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { portfolioServices, servicesForProject, filterPortfolioProjects } from "@/data/portfolio-services";

describe("Confirmed portfolio service taxonomy", () => {
  it("retains all 18 original projects with unique slugs", () => {
    expect(projects).toHaveLength(18);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(18);
  });
  it("offers exactly the six requested services, not industries", () => {
    expect(portfolioServices).toEqual(["website", "googleAds", "metaAds", "seo", "automation", "customSoftware"]);
  });
  it("maps confirmed website work to the three website projects", () => {
    expect(projects.filter((p) => servicesForProject(p).includes("website")).map((p) => p.id)).toEqual([
      "bakir-teknik-servis", "detay-emlak", "turnalar-emlak",
    ]);
  });
  it("retains all eleven confirmed Google Ads assignments", () => {
    expect(projects.filter((p) => servicesForProject(p).includes("googleAds")).map((p) => p.id)).toEqual([
      "makwa-capital", "mrs-tutor", "solary-ca", "otto-deck", "unico-student", "ico-group", "mikos-store", "nove-group", "acro", "erimos", "day-antique",
    ]);
  });
  it("maps confirmed Instagram advertising and Meta Ads without losing original activities", () => {
    expect(projects.filter((p) => servicesForProject(p).includes("metaAds")).map((p) => p.id)).toEqual([
      "alfashopping", "ulger-emlak", "kiraz-beach-otel",
    ]);
    expect(projects.find((p) => p.id === "alfashopping")?.services).toEqual(["igContent", "igAds", "accountOps"]);
  });
  it("assigns custom software only to the confirmed platform development project", () => {
    expect(projects.filter((p) => servicesForProject(p).includes("customSoftware")).map((p) => p.id)).toEqual(["konum-ca"]);
  });
  it("never infers SEO or automation from lead generation or account operations", () => {
    expect(servicesForProject({ services: ["leadGen", "ecommerce", "igContent", "accountOps"] })).toEqual([]);
    expect(projects.flatMap(servicesForProject)).not.toContain("seo");
    expect(projects.flatMap(servicesForProject)).not.toContain("automation");
  });
  it("supports multiple confirmed services without duplicates", () => {
    expect(servicesForProject({ services: ["webDev", "webflow", "googleAds", "metaAds"] })).toEqual(["website", "googleAds", "metaAds"]);
  });
  it("combines service filtering and search", () => {
    expect(filterPortfolioProjects(projects, "googleAds", "mikos", (p) => p.name).map((p) => p.id)).toEqual(["mikos-store"]);
    expect(filterPortfolioProjects(projects, "website", "mikos", (p) => p.name)).toEqual([]);
  });
});