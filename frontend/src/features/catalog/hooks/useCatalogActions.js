import { useState } from "react";
import { useToast } from "../../../shared/toast/toastContext";
import { createProduct, deleteProduct, fetchTemplate, importProducts } from "../api/catalogApi";
import { MAX_UPLOAD_BYTES } from "../constants";

const XLSX_PATTERN = /\.xlsx$/i;

const saveBlob = (blob, filename) => {
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

/** Add, delete, upload and template download with busy state and toasts; `onChanged` runs after the catalog changes. */
export function useCatalogActions({ onChanged }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async (task, success) => {
    setBusy(true);
    try {
      const result = await task();
      if (success) toast.show({ tone: "success", message: success(result) });
      onChanged();
      return { ok: true, result };
    } catch (error) {
      toast.show({ tone: "error", message: error.message });
      return { ok: false, error };
    } finally {
      setBusy(false);
    }
  };

  return {
    busy,
    add: async (product) => {
      setBusy(true);
      try {
        await createProduct(product);
        toast.show({ tone: "success", message: `${product.name} added` });
        onChanged();
        return null;
      } catch (error) {
        return error.message;
      } finally {
        setBusy(false);
      }
    },
    remove: (product) => run(() => deleteProduct(product.id), () => `${product.name} deleted`),
    upload: (file) => {
      if (!XLSX_PATTERN.test(file.name)) return toast.show({ tone: "error", message: "Upload an Excel file (.xlsx)" });
      if (file.size > MAX_UPLOAD_BYTES) return toast.show({ tone: "error", message: "The file is larger than 1 MB" });

      return run(() => importProducts(file));
    },
    downloadTemplate: async () => {
      try {
        saveBlob(await fetchTemplate(), "chemquote-catalog-template.xlsx");
      } catch (error) {
        toast.show({ tone: "error", message: error.message });
      }
    },
  };
}
