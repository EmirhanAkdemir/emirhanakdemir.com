import { beforeEach, describe, expect, it, vi } from "vitest";

const mocked = vi.hoisted(() => ({
  rows: {} as Record<string, Record<string, unknown>[]>,
  failed: false,
  paths: [] as string[],
  signedError: false,
  clientOptions: undefined as unknown,
}));
vi.mock("@tanstack/react-start", () => ({ createServerFn: () => ({ handler: (handler: () => unknown) => handler }) }));
vi.mock("@tanstack/react-start/server", () => ({ setResponseHeader: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: (_url: string, _key: string, options: unknown) => {
  mocked.clientOptions = options;
  return {
    from: (table: string) => {
      const builder = {
        select: () => builder,
        eq: () => builder,
        order: () => builder,
        range: async () => ({ data: mocked.rows[table] ?? [], error: mocked.failed ? { message: "private provider details" } : null }),
      };
      return builder;
    },
    storage: { from: () => ({ createSignedUrls: async (paths: string[], seconds: number) => {
      mocked.paths = paths;
      expect(seconds).toBe(60);
      return mocked.signedError ? { data: null, error: "denied" } : {
        error: null,
        data: paths.map((path) => ({ path, signedUrl: `https://server-only-origin.example/storage/v1/object/sign/project-images/${path}?token=fixture`, error: null })),
      };
    } }) },
  };
} }));
import { readPublicPortfolio } from "@/lib/portfolio/public.functions";

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://test.example");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_fixture");
  vi.stubEnv("VITE_SUPABASE_URL", "https://browser.example");
  mocked.failed = false;
  mocked.signedError = false;
  mocked.paths = [];
  const row = { id: "live", slug: "live", name: "Live", agency: "", attribution_pending: false, industry: null, year_label: "2026", status: "published", featured: true, display_order: 0, original_services: ["webDev"], responsibilities: [], external_url: null };
  mocked.rows = {
    projects: [row, { ...row, id: "draft", status: "draft" }],
    project_translations: [{ project_id: "live", locale: "tr", description: "Updated TR" }, { project_id: "live", locale: "en", description: "Original EN" }],
    project_services: [{ project_id: "live", service_id: "metaAds" }],
    services: [{ id: "metaAds", name_tr: "Meta Ads", name_en: "Meta Ads" }],
    project_media: [
      { id: "cover", project_id: "live", storage_path: "live/cover.png", published: true, kind: "cover", alt_tr: "Kapak", alt_en: "Cover" },
      { id: "hidden", project_id: "live", storage_path: "live/hidden.png", published: false },
      { id: "draft", project_id: "draft", storage_path: "draft/cover.png", published: true },
      { id: "wrong-folder", project_id: "live", storage_path: "elsewhere/cover.png", published: true },
    ],
  };
});

describe("Anonymous public reader", () => {
  it("returns only published records, live translations and explicit assignments", async () => {
    const result = await readPublicPortfolio();
    expect(result.projects.map((p) => p.id)).toEqual(["live"]);
    expect(result.projects[0]?.description).toEqual({ tr: "Updated TR", en: "Original EN" });
    expect(result.projects[0]?.services).toEqual(["metaAds"]);
    expect(mocked.clientOptions).toMatchObject({ auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  });
  it("signs only eligible registered images and returns browser-facing URLs", async () => {
    const result = await readPublicPortfolio();
    expect(mocked.paths).toEqual(["live/cover.png"]);
    expect(result.projects[0]?.images[0]?.url).toBe("https://browser.example/storage/v1/object/sign/project-images/live/cover.png?token=fixture");
    expect(result.projects[0]?.images).toHaveLength(1);
  });
  it("returns a safe error without static fallback or provider details", async () => {
    mocked.failed = true;
    expect(await readPublicPortfolio()).toEqual({ projects: [], services: [], error: true, imageError: false });
  });
  it("keeps project content available when image signing fails", async () => {
    mocked.signedError = true;
    const result = await readPublicPortfolio();
    expect(result.error).toBe(false);
    expect(result.imageError).toBe(true);
    expect(result.projects[0]?.images).toEqual([]);
  });
});