import { queryOptions } from "@tanstack/react-query";
import { readCms } from "./admin.functions";
export const cmsQuery = () =>
  queryOptions({ queryKey: ["cms"], queryFn: () => readCms(), staleTime: 0 });
