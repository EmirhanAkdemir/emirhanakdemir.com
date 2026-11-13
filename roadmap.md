# Phase 1 CMS
- [x] Verify external connection and existing schema (external ref confirmed; owner display-name confirmation pending below).
- [x] Create secure schema, private media storage, and idempotent 18-project seed.
- [x] Replace industry filters with confirmed service filters while retaining static public reads.
- [x] Test import parity, public access, draft hiding, write denial, and non-admin authorization.
- [x] Document migrations, portability, and manual admin/auth steps in docs/CMS_PHASE1.md.
- [x] Public signup disabled, confirmed through live auth settings in Phase 2.
- [ ] Owner: confirm project display name and private GitHub migration sync (not exposed by available tools).
- [x] Owner reports first admin provisioned.

# Phase 2 CMS
- [x] Recheck publication-aware Storage policy and inventory; separate intentional access from unauthorized exposure in the verification report.
- [ ] Publication-aware Security panel classification: blocked by scanner controls; completed deep review reported no unauthorized exposure.
- [x] Correct Storage path checks; 87 live anonymous/member/admin checks and CMS upload passed; rescan retains the intentional public-read warning.
- [x] Implement secure admin login, session handling, and server-side authorization.
- [x] Build dashboard, project/bilingual editors, services, metrics, media, and settings.
- [x] Verify rules, signed-out protection, public parity, and document real-session testing limitations in docs/CMS_PHASE2.md.
- [x] Owner reports successful admin CMS saves to external Supabase.

# Public CMS cutover
- [x] Connect public projects, translations, confirmed services and published private-bucket images to anonymous live reads.
- [x] Preserve Journey/List designs, URL filters, loading/error/empty states and bilingual search-indexable detail pages.
- [x] Verify live Turkish update, unchanged English, 18 published projects, filters/search and publication boundaries without changing existing data.
- [x] Document refresh freshness and independent hosting requirements in docs/PUBLIC_CMS_CUTOVER.md.
- [ ] Owner: verify an actual published image and fresh admin-save-to-refresh flow (no images or managed external admin session available).
- [ ] Owner: verify independent Netlify deployment after supplying its runtime configuration (no connected Netlify deployment available).