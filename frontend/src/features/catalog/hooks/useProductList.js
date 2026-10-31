import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { fetchProducts } from "../api/catalogApi";

/** One server-searched page of the catalog. */
export function useProductList({ search, page, limit }) {
  return useAsyncResource(`catalog|${search}|${page}|${limit}`, (signal) => fetchProducts({ search, page, limit }, signal));
}
