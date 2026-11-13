# Public portfolio: live CMS cutover

## Data flow

The Turkish and English portfolio routes prime a per-request TanStack Query cache through `readPublicPortfolio`. That server function creates a fresh **anonymous publishable-key** Supabase client; it never uses a service-role client or forwards the administrator's session. Existing RLS remains unchanged.

- `projects`: published only, ordered by `display_order` then ID. Journey selects featured records from that ordered list; Archive shows every published record.
- `project_translations`: independent TR/EN descriptions and localized SEO/share fields.
- `project_services`: actual saved associations; original activities are not used to infer current service assignments.
- `services`: published, saved bilingual labels. The six established service keys remain the only filter options; industry is display/search metadata only.
- `project_media`: registered published images belonging to published project folders. Anonymous Storage creates 60-second signed links under the established RLS; Query renews them every 45 seconds while the view is active. Signing failures do not discard project text. No public bucket or privileged image endpoint was introduced.

All reads paginate instead of silently stopping at the Data API's default row cap. No records, tables, grants, policies, accounts or Storage objects were changed or reseeded. `src/data/projects.ts` remains only a migration reference/test fixture.

## Freshness

The reader disables shared response/request caching; Query has zero stale time and reloads on mount, focus and periodic refresh. A full page refresh fetches current Supabase content. Ordinary admin content saves therefore require **no rebuild or deployment after this one-time code cutover is published**. The currently published site does not receive this new code until Publish changes is used once.

Filter, search and Journey/List choices live in validated URL parameters and survive refresh. There is no static-data fallback masking errors. Loading, unavailable-content, empty-result and missing-detail states use localized messages.

## Search indexing and independent Netlify hosting

New public detail URLs are `/projects/<slug>` and `/en/projects/<slug>`. They remain SSR-enabled and return the live project description and localized title/description/Open Graph metadata in the initial HTML. Missing or unpublished slugs produce the not-found state; detail pages never query the admin reader.

The existing Nitro adapter switches to its `netlify` preset when Netlify sets `NETLIFY=true` during builds. Lovable retains its normal target. No extra proprietary data service was added: runtime content reads use the owner's external Supabase and standard TanStack/Nitro server functions.

For an independent deployment:

1. Build the repository with its existing build command on Netlify with server functions enabled; do not export it as a static-only SPA or prerender the live project pages.
2. Provide build-time `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_PROJECT_ID`, plus runtime `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, pointing to the existing external project. The public reader needs no service-role key.
3. Retain existing CMS server configuration for administration; any privileged credentials must remain server-only, never `VITE_*`.
4. Verify detail deep links, runtime environment availability, and the CMS sign-in flow on the actual Netlify origin before changing the primary domain.

An actual independent Netlify deployment was **not performed** in this workspace. SSR content and metadata were verified locally, not a promise that an unconfigured static-only hosting account will work.

## Verification performed

- **24 automated tests passed**, including publication hiding, featured ordering, saved-service filtering, TR/EN search isolation, anonymous client configuration, media eligibility, browser-facing signed URLs, read failures and Storage-signing failure behavior.
- Read the stored Bakır Teknik Servis description and verified exact public Turkish output: `Bakır Teknik Servis için web sitesi geliştirme. test totot`.
- Verified English remains `Website development for Bakır Teknik Servis.` and does not include the Turkish test addition.
- Anonymous live API returned **18 published projects**; Archive showed all **18**, Journey showed **8** in the returned order.
- Verified the added Bakır Meta Ads association appears publicly: **4 Meta Ads projects**, **11 Google Ads projects**. Searching Google Ads for `mikos` returns only Mikos Store; that filter/search survives a refresh.
- Opened a project from the Archive, checked both detail languages, and confirmed the updated Bakır text plus project-specific SEO metadata exists in the raw server-rendered HTML.
- Queried anonymous `status != published`: no rows returned. Existing database policies explicitly restrict public projects to published status; tests independently prove draft/archived filtering even if an upstream response contains them.
- Verified an unknown detail URL produces a localized not-found state; desktop and 390px mobile portfolio display without horizontal overflow; both DJ routes still render. Browser reported **zero page errors**.
- Hero, About, Contact, DJ Universe, design tokens and typography files were not edited. Journey/List layout rules were retained.

### Verification limits

There are currently **no draft projects, registered media rows or stored images** in the connected project. No disposable live records were inserted because the brief prohibits altering/reseeding data. Current live draft exclusion is therefore verified through policy inspection, an anonymous empty hidden-status query, and automated adversarial fixtures—not a fresh download of a populated live draft. The signed-image integration passed mocked-reader tests, but there was no actual portfolio image available to display/download in this turn. Earlier Storage security live tests are separate historical evidence, not rerun results.

Real admin editing was reported successful by the owner. No external managed browser session is available here; no fresh admin save was performed. Refreshing the already-edited live description verifies that stored content—not the source fixture—is rendered, and the request-time data flow removes deployment from ordinary content reads. End-to-end editing-to-refresh with another new save remains an owner check.