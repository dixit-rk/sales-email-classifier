import { FlaskConical, Trash2 } from "lucide-react";
import { IconButton } from "../../../shared/ui";
import { MAX_ALIAS_PREVIEW } from "../constants";

const describe = ({ formula, aliases }) => {
  const shown = aliases.slice(0, MAX_ALIAS_PREVIEW).join(", ");
  const hidden = aliases.length - MAX_ALIAS_PREVIEW;
  const parts = [];

  if (formula) parts.push(formula);
  if (aliases.length) parts.push(`Aliases: ${shown}${hidden > 0 ? ` +${hidden} more` : ""}`);

  return parts.join(" · ") || "No formula or aliases";
};

/** One catalog product with its formula and aliases and a delete button. */
export function ProductRow({ product, onDelete }) {
  return (
    <li className="product-row catalog-row">
      <div className="catalog-row-main">
        <span className="sender-icon" aria-hidden="true"><FlaskConical /></span>
        <div className="catalog-row-text">
          <div className="catalog-row-title">
            <b>{product.name}</b>
            {product.itemCode && <span className="item-code" title="Item code">{product.itemCode}</span>}
          </div>
          <div className="catalog-row-meta" title={product.aliases.join(", ")}>{describe(product)}</div>
        </div>
      </div>
      <IconButton icon={Trash2} label={`Delete ${product.name}`} className="danger-icon" onClick={() => onDelete(product)} />
    </li>
  );
}
