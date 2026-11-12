import { createClient } from "@supabase/supabase-js";
import { projects } from "../src/data/projects";
import { portfolioServices, servicesForProject } from "../src/data/portfolio-services";

// Read-only verification against the owner-controlled backend. No user/admin keys.
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to the owner project.");
const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  } },
});
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
const { data: rows, error } = await client.from("projects").select("*").order("display_order");
if (error) throw error;
assert(rows?.length === 18, "Expected exactly 18 anonymous-readable projects");
const { data: translations, error: translationError } = await client.from("project_translations").select("*");
if (translationError) throw translationError;
assert(translations?.length === 36, "Expected 36 translations");
const { data: assignments, error: assignmentError } = await client.from("project_services").select("*");
if (assignmentError) throw assignmentError;
assert(assignments?.length === 18, "Expected 18 confirmed service associations");
for (const [order, source] of projects.entries()) {
  const row = rows.find((p) => p.id === source.id);
  assert(Boolean(row), `Missing ${source.id}`);
  for (const [db, expected] of Object.entries({ slug: source.slug, name: source.name, agency: source.context, attribution_pending: source.contextPending ?? false, industry: source.category, year_label: source.yearLabel, featured: source.featured, display_order: order, original_services: source.services, responsibilities: source.responsibilities, status: "published", external_url: null, thumbnail_url: null, links: [], verified_results: [] })) {
    assert(JSON.stringify(row[db]) === JSON.stringify(expected), `${source.id}: mismatch in ${db}`);
  }
  for (const locale of ["tr", "en"] as const) {
    assert(translations.find((t) => t.project_id === source.id && t.locale === locale)?.description === source.description[locale], `${source.id}: ${locale} description mismatch`);
  }
  assert(JSON.stringify(assignments.filter((a) => a.project_id === source.id).map((a) => a.service_id).sort()) === JSON.stringify(servicesForProject(source).sort()), `${source.id}: service mismatch`);
}
const { data: services } = await client.from("services").select("id");
assert(JSON.stringify(services?.map((s) => s.id).sort()) === JSON.stringify([...portfolioServices].sort()), "Six service IDs must match");
const { error: rolesError } = await client.from("user_roles").select("*");
assert(Boolean(rolesError), "Anonymous users must not read roles");
console.log("PASS: 18 projects, every preserved field, 36 translations, 18 associations, six services, anonymous role-read denial.");