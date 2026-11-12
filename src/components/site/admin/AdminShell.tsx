import { useState } from "react";
import { Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FolderOpen,
  Image,
  SlidersHorizontal,
  BarChart3,
  Settings,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminLocale, useAdmin } from "./shared";
import type { Locale } from "@/i18n";
const items = [
  ["/admin", "dashboard", LayoutDashboard],
  ["/admin/projects", "projects", FolderOpen],
  ["/admin/media", "media", Image],
  ["/admin/services", "services", SlidersHorizontal],
  ["/admin/metrics", "metrics", BarChart3],
  ["/admin/settings", "settings", Settings],
] as const;
export function AdminShell() {
  const [locale, setLocale] = useState<Locale>("tr");
  return (
    <AdminLocale.Provider value={{ locale, setLocale }}>
      <Shell />
    </AdminLocale.Provider>
  );
}
function Shell() {
  const { t, locale, setLocale } = useAdmin();
  const navigate = useNavigate();
  const cache = useQueryClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="border-b border-border md:fixed md:inset-y-0 md:w-64 md:border-r">
        <div className="p-6">
          <Link to="/admin" className="font-display text-xl">
            Emirhan Akdemir
            <span className="mt-2 block font-mono text-xs text-primary">{t.title}</span>
          </Link>
        </div>
        <nav className="flex overflow-x-auto px-3 pb-3 md:flex-col md:gap-2">
          {items.map(([to, key, Icon]) => (
            <Button
              key={to}
              asChild
              variant="ghost"
              className="shrink-0 justify-start px-4 md:h-11"
            >
              <Link
                to={to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-muted text-primary" }}
              >
                <Icon />
                {t[key]}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="hidden border-t border-border p-6 md:absolute md:bottom-0 md:block md:w-full">
          <ShieldCheck className="mb-3 size-5 text-primary" />
          <p className="font-mono text-xs text-muted-foreground">{t.role}</p>
        </div>
      </aside>
      <div className="md:ml-64">
        <header className="flex flex-wrap items-center justify-end gap-2 border-b border-border px-5 py-4 md:px-10">
          <div className="mr-auto font-mono text-xs text-muted-foreground">CMS / 02</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
            aria-label={t.language}
          >
            {locale === "tr" ? "EN" : "TR"}
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              {t.website}
              <ArrowUpRight />
            </Link>
          </Button>
          <Button
            disabled={busy}
            variant="outline"
            size="sm"
            onClick={async () => {
              setBusy(true);
              await cache.cancelQueries();
              cache.clear();
              const r = await supabase.auth.signOut();
              if (r.error) {
                setBusy(false);
                return;
              }
              await navigate({ to: "/admin/login", replace: true });
              void router.invalidate();
            }}
          >
            <LogOut />
            {t.logout}
          </Button>
        </header>
        <main className="mx-auto max-w-7xl p-5 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
