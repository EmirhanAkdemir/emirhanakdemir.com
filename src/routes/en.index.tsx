import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/site/PortfolioPage";
import { pageHead } from "@/i18n";
import { en } from "@/i18n/en";
import { publicPortfolioQuery } from "@/lib/portfolio/queries";
import { validatePortfolioSearch } from "@/lib/portfolio/model";
import { PortfolioRouteState } from "@/components/site/work/PortfolioRouteState";

export const Route = createFileRoute("/en/")({
  validateSearch: validatePortfolioSearch,
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(publicPortfolioQuery()); },
  pendingComponent: () => <PortfolioRouteState locale="en" state="loading" />,
  errorComponent: () => <PortfolioRouteState locale="en" state="error" />,
  notFoundComponent: () => <PortfolioRouteState locale="en" state="notFound" />,
  head: () => pageHead(en.meta.title, en.meta.description, "en"),
  component: () => <PortfolioPage locale="en" />,
});
