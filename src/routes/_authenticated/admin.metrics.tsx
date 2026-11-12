import { createFileRoute } from "@tanstack/react-router";
import { Metrics } from "@/components/site/admin/Catalog";
import { adminHead } from "@/components/site/admin/shared";
import { cmsQuery } from "@/lib/cms/queries";
export const Route = createFileRoute("/_authenticated/admin/metrics")({
  loader: ({ context }) => context.queryClient.ensureQueryData(cmsQuery()),
  head: () => adminHead("Portfolio Metrics"),
  component: Metrics,
});
