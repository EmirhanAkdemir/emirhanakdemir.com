CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, role text NOT NULL CHECK (role = 'admin'), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY roles_read_self ON public.user_roles FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE FUNCTION public.has_role(_user_id uuid, _role text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT _user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role); $$;
REVOKE ALL ON FUNCTION public.has_role(uuid,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,text) TO authenticated;
CREATE FUNCTION public.cms_touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.cms_touch_updated_at() FROM PUBLIC;

CREATE TABLE public.projects (id text PRIMARY KEY, slug text NOT NULL UNIQUE, name text NOT NULL, agency text NOT NULL DEFAULT '', attribution_pending boolean NOT NULL DEFAULT false, industry text, year_label text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')), featured boolean NOT NULL DEFAULT false, display_order integer NOT NULL DEFAULT 0, original_services text[] NOT NULL DEFAULT '{}', responsibilities text[] NOT NULL DEFAULT '{}', thumbnail_url text, external_url text, links jsonb NOT NULL DEFAULT '[]', verified_results jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY projects_public ON public.projects FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY projects_admin ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.project_translations (project_id text NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE, locale text NOT NULL CHECK (locale IN ('tr','en')), description text NOT NULL DEFAULT '', seo_title text, seo_description text, og_title text, og_description text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(project_id,locale));
GRANT SELECT ON public.project_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_translations TO authenticated;
GRANT ALL ON public.project_translations TO service_role;
ALTER TABLE public.project_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY translations_public ON public.project_translations FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'published'));
CREATE POLICY translations_admin ON public.project_translations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.services (id text PRIMARY KEY, name_tr text NOT NULL, name_en text NOT NULL, published boolean NOT NULL DEFAULT false, display_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY services_public ON public.services FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY services_admin ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.project_services (project_id text NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE, service_id text NOT NULL REFERENCES public.services(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(project_id,service_id));
GRANT SELECT ON public.project_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_services TO authenticated;
GRANT ALL ON public.project_services TO service_role;
ALTER TABLE public.project_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY project_services_public ON public.project_services FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'published') AND EXISTS (SELECT 1 FROM public.services s WHERE s.id = service_id AND s.published));
CREATE POLICY project_services_admin ON public.project_services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.project_media (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id text NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE, storage_path text NOT NULL UNIQUE, kind text NOT NULL DEFAULT 'gallery' CHECK(kind IN ('gallery','cover')), alt_tr text NOT NULL DEFAULT '', alt_en text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT false, display_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CHECK (storage_path LIKE project_id || '/%'));
GRANT SELECT ON public.project_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_media TO authenticated;
GRANT ALL ON public.project_media TO service_role;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY media_public ON public.project_media FOR SELECT TO anon, authenticated USING (published AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'published'));
CREATE POLICY media_admin ON public.project_media FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_metrics (id text PRIMARY KEY, label_tr text NOT NULL, label_en text NOT NULL, value text NOT NULL, verified boolean NOT NULL DEFAULT false, published boolean NOT NULL DEFAULT false, display_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_metrics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_metrics TO authenticated;
GRANT ALL ON public.site_metrics TO service_role;
ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY metrics_public ON public.site_metrics FOR SELECT TO anon, authenticated USING (published AND verified);
CREATE POLICY metrics_admin ON public.site_metrics FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['user_roles','projects','project_translations','services','project_services','project_media','site_metrics'] LOOP EXECUTE format('CREATE TRIGGER cms_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.cms_touch_updated_at()',t); END LOOP; END; $$;
CREATE INDEX projects_public_order ON public.projects(status,display_order);
CREATE INDEX project_services_service ON public.project_services(service_id);
CREATE INDEX project_media_project ON public.project_media(project_id);
CREATE POLICY cms_images_public ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'project-images' AND EXISTS (SELECT 1 FROM public.project_media m JOIN public.projects p ON p.id = m.project_id WHERE m.storage_path = name AND m.published AND p.status = 'published'));
CREATE POLICY cms_images_admin_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY cms_images_admin_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin') AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = (storage.foldername(name))[1]));
CREATE POLICY cms_images_admin_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin')) WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin') AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = (storage.foldername(name))[1]));
CREATE POLICY cms_images_admin_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));

INSERT INTO public.services(id,name_tr,name_en,published,display_order) VALUES
('website','Web Tasarım & Geliştirme','Website Design & Development',true,0),('googleAds','Google Ads','Google Ads',true,1),('metaAds','Meta Ads','Meta Ads',true,2),('seo','SEO','SEO',true,3),('automation','Pazarlama Otomasyonu','Marketing Automation',true,4),('customSoftware','Özel Yazılım','Custom Software',true,5) ON CONFLICT(id) DO NOTHING;

-- Literal source data; rerunning this seed never duplicates or overwrites later admin edits.
INSERT INTO public.projects(id,slug,name,agency,attribution_pending,industry,year_label,status,featured,display_order,original_services,responsibilities) VALUES
('bakir-teknik-servis','bakir-teknik-servis','Bakır Teknik Servis','Personal',false,'local','2026—','published',true,0,ARRAY['webDev'],ARRAY['webDev']),
('detay-emlak','detay-emlak','Detay Emlak','Personal',false,'realestate','2025—','published',true,1,ARRAY['webDev'],ARRAY['webDev']),
('alfashopping','alfashopping','Alfashopping','Personal',false,'ecommerce','2025—','published',false,2,ARRAY['igContent','igAds','accountOps'],ARRAY['igContent','igAds','accountOps']),
('ulger-emlak','ulger-emlak','Ülger Emlak','Personal',false,'realestate','2025—','published',false,3,ARRAY['igContent','igAds'],ARRAY['igContent','igAds']),
('kiraz-beach-otel','kiraz-beach-otel','Kiraz Beach Otel','Kolektif Ninja',false,'hospitality','2025','published',true,4,ARRAY['metaAds','leadGen'],ARRAY['metaAds','leadGen']),
('konum-ca','konum-ca','Konum.ca','',true,'platform','2024—2026','published',true,5,ARRAY['platform'],ARRAY['platform']),
('makwa-capital','makwa-capital','Makwa Capital','Kolektif Ninja',false,'finance','2024','published',true,6,ARRAY['googleAds','leadGen'],ARRAY['googleAds','leadGen']),
('mrs-tutor','mrs-tutor','Mrs. Tutor','Kolektif Ninja',false,'education','2025','published',false,7,ARRAY['googleAds','leadGen'],ARRAY['googleAds','leadGen']),
('solary-ca','solary-ca','Solary.ca','Kolektif Ninja',false,'energy','2025','published',false,8,ARRAY['googleAds','leadGen'],ARRAY['googleAds','leadGen']),
('otto-deck','otto-deck','Otto Deck','Kolektif Ninja',false,'home','2025','published',false,9,ARRAY['googleAds','leadGen'],ARRAY['googleAds','leadGen']),
('unico-student','unico-student','Unico Student','Kolektif Ninja',false,'education','2024—2025','published',false,10,ARRAY['googleAds','leadGen'],ARRAY['googleAds','leadGen']),
('ico-group','ico-group','ICO Group','Kolektif Ninja',false,'b2b','2024—2025','published',false,11,ARRAY['googleAds','leadGen'],ARRAY['googleAds','leadGen']),
('mikos-store','mikos-store','Mikos Store','Turnalar',false,'ecommerce','2023—2024','published',true,12,ARRAY['googleAds','ecommerce'],ARRAY['googleAds','ecommerce']),
('nove-group','nove-group','Nove Group','Turnalar',false,'healthcare','2023—2024','published',true,13,ARRAY['googleAds','leadGen'],ARRAY['googleAds','leadGen']),
('acro','acro','Acro','Turnalar',false,'ecommerce','2023—2024','published',false,14,ARRAY['googleAds','ecommerce'],ARRAY['googleAds','ecommerce']),
('erimos','erimos','Erimos','Turnalar',false,'ecommerce','2023—2024','published',false,15,ARRAY['googleAds','ecommerce'],ARRAY['googleAds','ecommerce']),
('day-antique','day-antique','Day Antique','Turnalar',false,'ecommerce','2023—2024','published',false,16,ARRAY['googleAds','ecommerce'],ARRAY['googleAds','ecommerce']),
('turnalar-emlak','turnalar-emlak','Turnalar Emlak','Turnalar Emlak',false,'realestate','2023—2024','published',true,17,ARRAY['webflow'],ARRAY['webflow']) ON CONFLICT DO NOTHING;
INSERT INTO public.project_translations(project_id,locale,description) VALUES
('bakir-teknik-servis','tr','Bakır Teknik Servis için web sitesi geliştirme.'),('bakir-teknik-servis','en','Website development for Bakır Teknik Servis.'),
('detay-emlak','tr','Detay Emlak için web sitesi geliştirme.'),('detay-emlak','en','Website development for Detay Emlak.'),
('alfashopping','tr','Alfashopping için Instagram içerik, reklam ve hesap operasyonları.'),('alfashopping','en','Instagram content, advertising and account operations for Alfashopping.'),
('ulger-emlak','tr','Ülger Emlak için Instagram içerik ve reklam yönetimi.'),('ulger-emlak','en','Instagram content and advertising for Ülger Emlak.'),
('kiraz-beach-otel','tr','Kiraz Beach Otel için Meta Ads ile rezervasyon talebi üretimi.'),('kiraz-beach-otel','en','Reservation lead generation with Meta Ads for Kiraz Beach Otel.'),
('konum-ca','tr','Konum.ca platformunun sıfırdan geliştirilmesi.'),('konum-ca','en','Konum.ca platform built from scratch.'),
('makwa-capital','tr','Makwa Capital için Google Ads ile lead üretimi.'),('makwa-capital','en','Lead generation with Google Ads for Makwa Capital.'),
('mrs-tutor','tr','Mrs. Tutor için Google Ads ile lead üretimi.'),('mrs-tutor','en','Lead generation with Google Ads for Mrs. Tutor.'),
('solary-ca','tr','Solary.ca için Google Ads ile lead üretimi.'),('solary-ca','en','Lead generation with Google Ads for Solary.ca.'),
('otto-deck','tr','Otto Deck için Google Ads ile lead üretimi.'),('otto-deck','en','Lead generation with Google Ads for Otto Deck.'),
('unico-student','tr','Unico Student için Google Ads ile lead üretimi.'),('unico-student','en','Lead generation with Google Ads for Unico Student.'),
('ico-group','tr','ICO Group için Google Ads ile lead üretimi.'),('ico-group','en','Lead generation with Google Ads for ICO Group.'),
('mikos-store','tr','Mikos Store için Google Ads e-ticaret kampanyaları.'),('mikos-store','en','Google Ads e-commerce campaigns for Mikos Store.'),
('nove-group','tr','Nove Group için sağlık alanında Google Ads lead üretimi.'),('nove-group','en','Healthcare lead generation with Google Ads for Nove Group.'),
('acro','tr','Acro için Google Ads e-ticaret kampanyaları.'),('acro','en','Google Ads e-commerce campaigns for Acro.'),
('erimos','tr','Erimos için Google Ads e-ticaret kampanyaları.'),('erimos','en','Google Ads e-commerce campaigns for Erimos.'),
('day-antique','tr','Day Antique için Google Ads e-ticaret kampanyaları.'),('day-antique','en','Google Ads e-commerce campaigns for Day Antique.'),
('turnalar-emlak','tr','Turnalar Emlak için Webflow ile web sitesi geliştirme.'),('turnalar-emlak','en','Webflow website development for Turnalar Emlak.') ON CONFLICT DO NOTHING;
INSERT INTO public.project_services(project_id,service_id) VALUES
('bakir-teknik-servis','website'),('detay-emlak','website'),('turnalar-emlak','website'),
('alfashopping','metaAds'),('ulger-emlak','metaAds'),('kiraz-beach-otel','metaAds'),('konum-ca','customSoftware'),
('makwa-capital','googleAds'),('mrs-tutor','googleAds'),('solary-ca','googleAds'),('otto-deck','googleAds'),('unico-student','googleAds'),('ico-group','googleAds'),('mikos-store','googleAds'),('nove-group','googleAds'),('acro','googleAds'),('erimos','googleAds'),('day-antique','googleAds') ON CONFLICT DO NOTHING;