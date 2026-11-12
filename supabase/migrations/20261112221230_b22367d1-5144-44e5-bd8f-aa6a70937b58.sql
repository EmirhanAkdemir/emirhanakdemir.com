CREATE FUNCTION public.cms_save_project(payload jsonb) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE pid text := payload->>'id'; existing public.projects; item jsonb; sid text;
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'CMS_ACCESS_DENIED'; END IF;
 SELECT * INTO existing FROM public.projects WHERE id=pid FOR UPDATE;
 IF FOUND THEN
   IF payload->>'expected_updated_at' IS NULL OR existing.updated_at <> (payload->>'expected_updated_at')::timestamptz THEN RAISE EXCEPTION 'CMS_CONFLICT'; END IF;
   UPDATE public.projects SET slug=payload->>'slug', name=payload->>'name', agency=payload->>'agency', attribution_pending=(payload->>'attribution_pending')::boolean, year_label=payload->>'year_label', status=payload->>'status', featured=(payload->>'featured')::boolean, display_order=(payload->>'display_order')::integer, responsibilities=ARRAY(SELECT jsonb_array_elements_text(payload->'responsibilities')), external_url=NULLIF(payload->>'external_url',''), links=payload->'links', verified_results=payload->'verified_results' WHERE id=pid;
 ELSE
   IF payload->>'expected_updated_at' IS NOT NULL THEN RAISE EXCEPTION 'CMS_CONFLICT'; END IF;
   INSERT INTO public.projects(id,slug,name,agency,attribution_pending,year_label,status,featured,display_order,responsibilities,external_url,links,verified_results) VALUES(pid,payload->>'slug',payload->>'name',payload->>'agency',(payload->>'attribution_pending')::boolean,payload->>'year_label',payload->>'status',(payload->>'featured')::boolean,(payload->>'display_order')::integer,ARRAY(SELECT jsonb_array_elements_text(payload->'responsibilities')),NULLIF(payload->>'external_url',''),payload->'links',payload->'verified_results');
 END IF;
 IF jsonb_array_length(payload->'translations')<>2 OR NOT (payload->'translations' @> '[{"locale":"tr"},{"locale":"en"}]'::jsonb) THEN RAISE EXCEPTION 'CMS_INVALID_LOCALES'; END IF;
 FOR item IN SELECT jsonb_array_elements(payload->'translations') LOOP
 INSERT INTO public.project_translations(project_id,locale,description,seo_title,seo_description,og_title,og_description) VALUES(pid,item->>'locale',item->>'description',item->>'seo_title',item->>'seo_description',item->>'og_title',item->>'og_description') ON CONFLICT(project_id,locale) DO UPDATE SET description=excluded.description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,og_title=excluded.og_title,og_description=excluded.og_description;
 END LOOP;
 DELETE FROM public.project_services WHERE project_id=pid;
 FOR sid IN SELECT DISTINCT jsonb_array_elements_text(payload->'services') LOOP
 IF sid NOT IN ('website','googleAds','metaAds','seo','automation','customSoftware') THEN RAISE EXCEPTION 'CMS_INVALID_SERVICE'; END IF;
 INSERT INTO public.project_services(project_id,service_id) VALUES(pid,sid);
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.cms_save_project(jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cms_save_project(jsonb) TO authenticated;
CREATE FUNCTION public.cms_save_media(payload jsonb) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE pid text:=payload->>'project_id'; mid uuid:=(payload->>'id')::uuid; revision timestamptz;
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'CMS_ACCESS_DENIED'; END IF;
 PERFORM id FROM public.projects WHERE id=pid FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'CMS_INVALID_PROJECT'; END IF;
 IF payload->>'storage_path' NOT LIKE pid||'/%' THEN RAISE EXCEPTION 'CMS_INVALID_PATH'; END IF;
 SELECT updated_at INTO revision FROM public.project_media WHERE id=mid AND project_id=pid FOR UPDATE;
 IF FOUND AND (payload->>'expected_updated_at' IS NULL OR revision<>(payload->>'expected_updated_at')::timestamptz) THEN RAISE EXCEPTION 'CMS_CONFLICT'; END IF;
 IF payload->>'kind'='cover' THEN UPDATE public.project_media SET kind='gallery' WHERE project_id=pid AND kind='cover' AND id<>mid; END IF;
 INSERT INTO public.project_media(id,project_id,storage_path,kind,alt_tr,alt_en,published,display_order) VALUES(mid,pid,payload->>'storage_path',payload->>'kind',payload->>'alt_tr',payload->>'alt_en',(payload->>'published')::boolean,(payload->>'display_order')::integer) ON CONFLICT(id) DO UPDATE SET storage_path=excluded.storage_path,kind=excluded.kind,alt_tr=excluded.alt_tr,alt_en=excluded.alt_en,published=excluded.published,display_order=excluded.display_order WHERE public.project_media.project_id=pid;
END $$;
REVOKE ALL ON FUNCTION public.cms_save_media(jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cms_save_media(jsonb) TO authenticated;