import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/site/PortfolioPage";
import { pageHead } from "@/i18n";
import { tr } from "@/i18n/tr";
import { publicPortfolioQuery } from "@/lib/portfolio/queries";
import { validatePortfolioSearch } from "@/lib/portfolio/model";
import { PortfolioRouteState } from "@/components/site/work/PortfolioRouteState";

export const Route = createFileRoute("/")({
  validateSearch: validatePortfolioSearch,
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(publicPortfolioQuery()); },
  pendingComponent: () => <PortfolioRouteState locale="tr" state="loading" />,
  errorComponent: () => <PortfolioRouteState locale="tr" state="error" />,
  notFoundComponent: () => <PortfolioRouteState locale="tr" state="notFound" />,
  head: () => pageHead(tr.meta.title, tr.meta.description, "tr"),
  component: () => <PortfolioPage locale="tr" />,
});
