import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { canAdmin } from "@/lib/cms/rules";
import { AdminShell } from "@/components/site/admin/AdminShell";
export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: context.user.id,
      _role: "admin",
    });
    if (error || !canAdmin(data)) throw redirect({ to: "/admin/login" });
  },
  component: AdminShell,
});
