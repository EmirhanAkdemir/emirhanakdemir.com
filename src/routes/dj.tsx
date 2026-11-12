import { createFileRoute } from "@tanstack/react-router";
import { DjPage } from "@/components/site/DjPage";
import { pageHead } from "@/i18n";
import { tr } from "@/i18n/tr";

export const Route = createFileRoute("/dj")({
  head: () => pageHead(tr.meta.djTitle, tr.meta.djDescription, "tr"),
  component: () => <DjPage locale="tr" />,
});
