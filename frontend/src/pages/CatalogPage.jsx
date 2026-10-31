import { Download, FlaskConical, Plus, SearchX, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  AddProductDialog, CATALOG_DEFAULTS, ImportResultDialog, ProductRow, useCatalogActions, useProductList,
} from "../features/catalog";
import { useListParams } from "../shared/hooks/useListParams";
import { usePageClamp } from "../shared/hooks/usePageClamp";
import { Button, ConfirmDialog, EmptyState, ErrorState, LoadingState, PageHeader, Pagination, SearchInput } from "../shared/ui";

/** Product catalog: server-side search and pagination, add and delete, and Excel upload with a template. */
export default function CatalogPage() {
  const { params, update } = useListParams(CATALOG_DEFAULTS);
  const { data, error, loading, reload } = useProductList(params);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const fileInput = useRef(null);
  const actions = useCatalogActions({ onChanged: reload });
  const meta = data?.meta;
  const total = meta?.total ?? 0;

  const setPage = useCallback((page) => update({ page }, { resetPage: false }), [update]);
  usePageClamp(meta, Number(params.page), setPage);

  const confirmDelete = async () => {
    await actions.remove(deleting);
    setDeleting(null);
  };

  const chooseFile = async (event) => {
    const [file] = event.target.files;

    event.target.value = "";
    if (!file) return;

    const outcome = await actions.upload(file);
    if (outcome?.ok) setImportResult(outcome.result);
  };

  const body = () => {
    if (error) return <ErrorState message={error.message} onRetry={reload} />;
    if (!data) return <LoadingState label="Loading catalog…" />;
    if (data.data.length === 0) {
      return (
        <div className="panel">
          <EmptyState
            icon={params.search ? SearchX : FlaskConical}
            title={params.search ? "No products match this search" : "No products yet"}
            hint={params.search ? "Try a different name, item code, alias or formula." : "Add a product, or upload an Excel sheet to add many at once."}
          />
        </div>
      );
    }

    return (
      <div className="panel">
        <ul className="catalog-list" aria-busy={loading}>
          {data.data.map((product) => <ProductRow key={product.id} product={product} onDelete={setDeleting} />)}
        </ul>
      </div>
    );
  };

  return (
    <div className="content catalog-wrap">
      <PageHeader
        eyebrow="MATCHING RULES"
        title="Product catalog"
        subtitle="Chemicals the AI should recognize as your company's products."
        actions={
          <div className="catalog-actions">
            <Button icon={Download} onClick={actions.downloadTemplate}>Template</Button>
            <Button icon={Upload} onClick={() => fileInput.current.click()} busy={actions.busy} busyLabel="Working…">Upload Excel</Button>
            <Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add product</Button>
            <input ref={fileInput} type="file" accept=".xlsx" hidden onChange={chooseFile} aria-label="Excel file of products" />
          </div>
        }
      />
      <SearchInput value={params.search} onSearch={(search) => update({ search })} label="Search products" placeholder="Search by product name, item code, alias or formula" />
      {body()}
      {total > 0 && <Pagination meta={meta} onPage={setPage} onLimit={(limit) => update({ limit })} />}
      <AddProductDialog open={adding} saving={actions.busy} onSubmit={actions.add} onClose={() => setAdding(false)} />
      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${deleting?.name ?? "product"}?`}
        message="New emails will no longer be matched to this product. Emails that were already classified keep their results."
        confirmLabel="Delete"
        busy={actions.busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
      <ImportResultDialog result={importResult} onClose={() => setImportResult(null)} />
    </div>
  );
}
