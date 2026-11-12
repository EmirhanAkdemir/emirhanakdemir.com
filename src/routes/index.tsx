import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/site/PortfolioPage";
import { pageHead } from "@/i18n";
import { tr } from "@/i18n/tr";

export const Route = createFileRoute("/")({
  head: () => pageHead(tr.meta.title, tr.meta.description, "tr"),
  component: () => <PortfolioPage locale="tr" />,
});
