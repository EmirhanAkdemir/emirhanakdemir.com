import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/admin/Catalog";
import { adminHead } from "@/components/site/admin/shared";
import { cmsQuery } from "@/lib/cms/queries";
export const Route = createFileRoute("/_authenticated/admin/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(cmsQuery()),
  head: () => adminHead("Services"),
  component: Services,
});
