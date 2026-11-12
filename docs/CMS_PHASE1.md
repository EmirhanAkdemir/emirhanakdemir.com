# Portfolio CMS — Phase 1 implementation report

## Connection and scope
- Verified external, not Lovable-managed Supabase: `oqgzanymeytbjnyvfnen`, organization `uogfjyuwdshgkuvtrarf`, API `https://oqgzanymeytbjnyvfnen.supabase.co`.
- The public schema initially had no tables or policies. No separate backend was created.
- Connection metadata does not expose the project display name or prove legal ownership. Owner must confirm this ref is **emirhanakdemir.com** in their Supabase dashboard.
- No admin dashboard, sign-in code, signup form, or public database query cutover was added. Existing static public data remains authoritative for rendering. All four pages and DJ mode remain intact; the archive now has service-only filters.

## Tables and imported content
| Table | Purpose | Imported rows |
|---|---|---:|
| projects | Names, slugs, agency/context, attribution pending, industry metadata, year, status, featured, ordering, original service keys, responsibilities, optional links/results | 18 |
| project_translations | TR/EN descriptions and optional SEO/OG fields | 36 |
| services | Expandable bilingual service taxonomy | 6 |
| project_services | Many-to-many confirmed service assignments | 18 |
| project_media | Ordered cover/gallery paths, bilingual alt text, publication state | 0 |
| site_metrics | Bilingual verified, publishable metrics | 0 |
| user_roles | Explicit administrator appointments | 0 |

Imported existing public records as published; new records default to draft. Unique primary keys/slugs and `ON CONFLICT DO NOTHING` make the literal seed repeatable without duplicates or overwriting future admin edits. Schema migrations are tracked and applied once; do not blindly rerun CREATE TABLE statements.

### Confirmed assignments
- Website Design & Development (3): Bakır Teknik Servis, Detay Emlak, Turnalar Emlak. Normalizes confirmed webDev/webflow.
- Google Ads (11): Makwa Capital, Mrs. Tutor, Solary.ca, Otto Deck, Unico Student, ICO Group, Mikos Store, Nove Group, Acro, Erimos, Day Antique.
- Meta Ads (3): Alfashopping, Ülger Emlak, Kiraz Beach Otel. Instagram advertising is normalized to Meta Ads; original Instagram activities remain preserved.
- Custom Software (1): Konum.ca, based on its confirmed from-scratch platform development.
- SEO (0) and Marketing Automation (0): available filters, no inferred assignments.
- Lead generation, e-commerce context, Instagram content, and account operations remain in original service and responsibility arrays; they do not imply SEO or automation.
- No images, links, results, achievements, or metric values were invented. Konum.ca attribution remains pending.

## Grants and access rules
- RLS enabled on all seven tables.
- `anon`: read-only grants on six content tables, no role-table access and no writes.
- `authenticated`: content read/write grants, but RLS allows writes only when the caller has an explicit admin role. Normal users only see published content.
- `user_roles`: authenticated users can read only their own appointments, with no browser write grants. Only trusted owner provisioning/service-role operations may assign roles.
- `service_role`: full grants for trusted provisioning; never included in browser code.
- Published project policy propagates to descriptions, service associations and media. Services must also be published; metrics must be both verified and published.
- Admin policies provide both read-all (including drafts) and manage-content paths.
- `has_role(uuid,text)` uses SECURITY INVOKER, caller identity equality, and read-own role RLS. Anonymous execution is revoked. This avoids privilege escalation and recursive role policies; server callers can use it through their authenticated client.
- Private bucket `project-images` created via Storage API. Admin uploads must use an existing project-ID folder. Visitors can read only paths registered as published media for published projects. Unregistered files and drafts are hidden. No files were uploaded.
- For later public media delivery, use short-lived signed URLs or RLS-authorized downloads, not public bucket URLs. Signed URLs remain valid until expiry even after unpublishing; use brief expiry times if immediate revocation matters.
- Do not put secrets in content fields. Published project fields are public by design.

## Version-controlled migrations
Under `supabase/migrations/`:
1. `20261112193915_b90f1962-bd7f-4c31-a0da-0db3f353dc0f.sql` — schema, grants, policies, triggers, literal 18-record seed, storage access policies.
2. `20261112193933_e2f2f2fb-73dc-41e5-be28-5aaaec2840a4.sql` — invoker-security role check.
3. `20261112194124_20444603-4e6e-47ad-a45d-48793378cac8.sql` — transactional security regression; fixtures automatically rolled back.

These files are in the project source. GitHub sync status and remote repository contents cannot be inspected from this session: confirm these files appear in the connected private repository. On a new Supabase project, create the private `project-images` bucket with the Storage API before applying the storage policies. Bucket provisioning itself is not SQL-portable; its required name/private setting is documented here.

## Verification completed
- `bun scripts/verify-cms.ts`: anonymous API reads verified every preserved field in all 18 records, both descriptions per project, all 18 associations, all six service IDs, and role-read denial.
- Transactional SQL regression: anonymous draft/translation/association/media hiding, unverified metric hiding, anonymous write denial, non-admin role check false, non-admin draft hiding, non-admin insert/update denial, and self-promotion denial passed. No test fixtures remain.
- 10 tests passed (nine taxonomy/data rules and the existing route test).
- Browser checked both languages: Google Ads returns 11 projects; searching Mikos returns one; All restores 18; DJ routes load; tested desktop and 656px mobile with no horizontal overflow or runtime errors.
- Current preview build reports OK.
- Newly introduced linter warning was resolved. Two pre-existing warnings remain on the existing SECURITY DEFINER event-trigger function `rls_auto_enable`; no CMS role function has definer security.

## Required owner actions / incomplete checks
1. **Disable public signup now.** The live `/auth/v1/settings` response reports `disable_signup: false`, email enabled, confirmation required, anonymous sign-in disabled. In Supabase Authentication settings, turn off **Allow new users to sign up**. No available tool can change this external project's auth settings. Recheck settings after saving.
2. Confirm the project ref/name and GitHub migration sync as described above.
3. Provision the first admin in Supabase **Authentication → Users → Add user** (or invite). Use your real email, a strong unique password, and MFA where supported. Do not enable public signup to create this account. No users exist currently.
4. In the trusted Supabase SQL Editor, run the following after replacing the placeholder with that user's real email. Verify exactly one existing account matches first. Never place this statement in public app code or a seed migration.

```sql
select id, email from auth.users where lower(email) = lower('<your-admin-email>');

insert into public.user_roles(user_id, role)
select id, 'admin' from auth.users
where lower(email) = lower('<your-admin-email>')
on conflict (user_id, role) do nothing;
```

5. **Positive real-admin authorization and image upload/download checks remain unverified**, because there are no Auth users and no project files. After provisioning, verify `has_role` returns true using that user's authenticated client, draft reads work, and content writes succeed; verify an ordinary user's check remains false. Do not manufacture credentials or grant an arbitrary test account admin. The negative database-role regression is not an authenticated browser sign-in test.

No auth UI is built in Phase 1. Before a later authentication implementation, decide whether additional profile data is needed; administrator roles always stay separate from profiles.

## Independent hosting / later Netlify deployment
- CMS persistence and security use PostgreSQL and standard Supabase APIs only, with no new proprietary runtime services.
- The generated preview auth-storage helper is pre-existing integration code, unused by Phase 1 CMS; it falls back to localStorage outside editor previews. Review/remove editor-specific helpers when preparing an independent export.
- Existing TanStack hosting configuration is unchanged. A Netlify runtime adapter, build/deploy configuration, environment bindings, and actual Netlify deployment are **not yet implemented or verified**.
- Supply the owner's Supabase URL/public key through hosting environment settings; keep any privileged key server-only. Future internal actions should use authenticated TanStack server functions and RLS, not an ordinary-read service-role client.
- For a later live-data cutover, provide admin-scoped list and by-ID reads for hidden content as well as safe published-only public reads; do not cut over merely because the import succeeded.
- Re-run `bun scripts/verify-cms.ts` for import parity; run `scripts/cms-security-regression.sql` in trusted SQL Editor for rollback-only permissions checks.