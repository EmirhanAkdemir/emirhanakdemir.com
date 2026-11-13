import { describe, expect, it } from "vitest";
import { publishedInOrder, visibleMedia, filterPublicProjects, type PublicProject } from "@/lib/portfolio/model";
import { tr } from "@/i18n/tr";

const project: PublicProject = {
  id: "bakir-teknik-servis", slug: "bakir-teknik-servis", name: "Bakır Teknik Servis", context: "Personal",
  contextPending: false, industry: "local", yearLabel: "2026—", featured: true, displayOrder: 0,
  services: ["website", "metaAds"], activities: ["webDev"], responsibilities: ["webDev"], externalUrl: null,
  description: { tr: "Bakır Teknik Servis için web sitesi geliştirme. test totot", en: "Website development for Bakır Teknik Servis." },
  seo: { tr: { title: null, description: null, ogTitle: null, ogDescription: null }, en: { title: null, description: null, ogTitle: null, ogDescription: null } }, images: [],
};
describe("Live public portfolio rules", () => {
  it("hides draft and archived projects", () => {
    expect(publishedInOrder([{ id: "draft", status: "draft", display_order: 0 }, { id: "archived", status: "archived", display_order: 1 }, { id: "live", status: "published", display_order: 2 }]).map((p) => p.id)).toEqual(["live"]);
  });
  it("keeps featured projects in admin-defined order", () => {
    expect(publishedInOrder([{ id: "later", status: "published", display_order: 9, featured: true }, { id: "first", status: "published", display_order: 0, featured: true }, { id: "list", status: "published", display_order: 1, featured: false }]).filter((p) => p.featured).map((p) => p.id)).toEqual(["first", "later"]);
  });
  it("uses saved service assignments, not original activities", () => {
    expect(filterPublicProjects([project], "metaAds", "", "tr", tr.work.portfolioServices).map((p) => p.id)).toEqual(["bakir-teknik-servis"]);
    expect(filterPublicProjects([project], "googleAds", "", "tr", tr.work.portfolioServices)).toEqual([]);
  });
  it("searches the updated Turkish description without altering English", () => {
    expect(filterPublicProjects([project], undefined, "test totot", "tr", tr.work.portfolioServices)).toHaveLength(1);
    expect(filterPublicProjects([project], undefined, "test totot", "en", tr.work.portfolioServices)).toHaveLength(0);
    expect(project.description.en).toBe("Website development for Bakır Teknik Servis.");
  });
  it("accepts images only for published media in the exact published project folder", () => {
    const rows = [
      { project_id: "live", storage_path: "live/cover.png", published: true },
      { project_id: "live", storage_path: "live/hidden.png", published: false },
      { project_id: "draft", storage_path: "draft/image.png", published: true },
      { project_id: "live", storage_path: "other/cover.png", published: true },
    ];
    expect(visibleMedia(rows, new Set(["live"])).map((m) => m.storage_path)).toEqual(["live/cover.png"]);
  });
});