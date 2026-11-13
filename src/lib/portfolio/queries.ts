import { queryOptions } from "@tanstack/react-query";
import { readPublicPortfolio } from "./public.functions";
export const publicPortfolioQuery = () => queryOptions({
  queryKey: ["public-portfolio"],
  queryFn: () => readPublicPortfolio(),
  staleTime: 0,
  refetchOnMount: "always",
  refetchOnWindowFocus: true,
  // Renew short-lived anonymous image links, without a stale module-level content cache.
  refetchInterval: 45_000,
});