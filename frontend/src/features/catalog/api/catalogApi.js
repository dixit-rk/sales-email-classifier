import { apiRequest } from "../../../shared/api/client";

const BASE = "/api/catalog";

/** One page of the catalog, searched and paginated by the server. */
export const fetchProducts = (query, signal) => apiRequest(BASE, { params: query, signal });

/** Adds a product `{ name, formula, aliases }`. */
export const createProduct = (product) => apiRequest(BASE, { method: "POST", body: product }).then((body) => body.data);

/** Deletes a product. */
export const deleteProduct = (id) => apiRequest(`${BASE}/${id}`, { method: "DELETE" });

/** Uploads an .xlsx of products; resolves to `{ created, updated, skipped, errors }`. */
export function importProducts(file) {
  const form = new FormData();
  form.append("file", file);

  return apiRequest(`${BASE}/import`, { method: "POST", body: form }).then((body) => body.data);
}

/** The Excel template as a downloadable blob. */
export const fetchTemplate = () => apiRequest(`${BASE}/template`, { asBlob: true });
