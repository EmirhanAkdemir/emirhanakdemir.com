-- Executable owner-side regression. Run in Supabase SQL Editor.
-- Entire transaction rolls back, including draft fixtures. No Auth users created.
BEGIN;
INSERT INTO public.projects(id,slug,name,status) VALUES ('cms-security-fixture','cms-security-fixture','Security fixture','draft');
INSERT INTO public.project_translations(project_id,locale,description) VALUES ('cms-security-fixture','tr','Draft');
INSERT INTO public.project_services(project_id,service_id) VALUES ('cms-security-fixture','website');
INSERT INTO public.project_media(project_id,storage_path) VALUES ('cms-security-fixture','cms-security-fixture/draft.png');
INSERT INTO public.site_metrics(id,label_tr,label_en,value,published,verified) VALUES ('cms-security-fixture','Test','Test','0',true,false);
SET LOCAL ROLE anon;
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM public.projects WHERE id='cms-security-fixture') THEN RAISE EXCEPTION 'Draft leaked'; END IF;
  IF EXISTS(SELECT 1 FROM public.project_translations WHERE project_id='cms-security-fixture') THEN RAISE EXCEPTION 'Draft translation leaked'; END IF;
  IF EXISTS(SELECT 1 FROM public.project_services WHERE project_id='cms-security-fixture') THEN RAISE EXCEPTION 'Draft service leaked'; END IF;
  IF EXISTS(SELECT 1 FROM public.project_media WHERE project_id='cms-security-fixture') THEN RAISE EXCEPTION 'Draft media leaked'; END IF;
  IF EXISTS(SELECT 1 FROM public.site_metrics WHERE id='cms-security-fixture') THEN RAISE EXCEPTION 'Unverified metric leaked'; END IF;
  BEGIN
    UPDATE public.projects SET name='Unauthorized' WHERE id='bakir-teknik-servis';
    RAISE EXCEPTION 'Anonymous write allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SET LOCAL ROLE authenticated;
-- Simulate an authenticated non-admin subject, not a real session or new user.
SELECT set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
DO $$ DECLARE affected integer; BEGIN
  IF public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Non-admin elevated'; END IF;
  IF EXISTS(SELECT 1 FROM public.projects WHERE id='cms-security-fixture') THEN RAISE EXCEPTION 'Non-admin sees draft'; END IF;
  UPDATE public.projects SET name='Unauthorized' WHERE id='bakir-teknik-servis';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Non-admin update allowed'; END IF;
  BEGIN
    INSERT INTO public.projects(id,slug,name) VALUES ('unauthorized-fixture','unauthorized-fixture','Unauthorized');
    RAISE EXCEPTION 'Non-admin insert allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    INSERT INTO public.user_roles(user_id,role) VALUES (auth.uid(),'admin');
    RAISE EXCEPTION 'Self-promotion allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
ROLLBACK;