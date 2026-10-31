import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./IconButton";
import { SelectField } from "./SelectField";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100].map((size) => ({ value: String(size), label: `${size} / page` }));

/** Server-side pagination controls: range summary, previous/next and page size. */
export function Pagination({ meta, onPage, onLimit }) {
  const { page, limit, total, totalPages } = meta;
  const first = total === 0 ? 0 : (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination-range">
        {first}–{last} of {total}
      </span>
      <SelectField label="Rows per page" value={String(limit)} options={PAGE_SIZE_OPTIONS} onChange={(value) => onLimit(Number(value))} />
      <IconButton icon={ChevronLeft} label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} />
      <span className="pagination-page">
        {page} / {Math.max(totalPages, 1)}
      </span>
      <IconButton icon={ChevronRight} label="Next page" disabled={page >= totalPages} onClick={() => onPage(page + 1)} />
    </nav>
  );
}
