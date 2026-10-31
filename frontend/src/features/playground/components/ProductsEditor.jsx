import { Plus, Trash2 } from "lucide-react";
import { Button, IconButton } from "../../../shared/ui";
import { MAX_ALIASES_TEXT, MAX_ITEM_CODE, MAX_NAME, MAX_PRODUCTS } from "../constants";

function ProductCard({ product, index, error, onChange, onRemove }) {
  const field = (name, label, maxLength, placeholder) => (
    <div className="pg-field">
      <label htmlFor={`pg-${name}-${product.id}`}>{label}</label>
      <input
        id={`pg-${name}-${product.id}`}
        value={product[name]}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={name === "name" && Boolean(error)}
        onChange={(event) => onChange(product.id, name, event.target.value)}
      />
    </div>
  );

  return (
    <li className="pg-product">
      <div className="pg-product-head">
        <span className="pg-product-number">{index + 1}</span>
        <IconButton icon={Trash2} size={16} label={`Remove product ${index + 1}`} onClick={() => onRemove(product.id)} />
      </div>
      {field("name", "Product name", MAX_NAME, "e.g. Polysorbate 80")}
      {error && <span className="field-error" role="alert">{error}</span>}
      {field("itemCode", "Item code (optional)", MAX_ITEM_CODE, "e.g. PCFG228")}
      {field("aliases", "Other names (optional)", MAX_ALIASES_TEXT, "e.g. Tween 80, lemon salt")}
    </li>
  );
}

/** Up to six products the AI should recognise, with the code and other names customers use. */
export function ProductsEditor({ products, problems, canAdd, onAdd, onChange, onRemove }) {
  return (
    <section className="panel pg-card" aria-labelledby="pg-products-title">
      <header className="pg-card-head">
        <div>
          <span className="pg-step">Step 1</span>
          <h2 id="pg-products-title">Your products</h2>
          <p>The products you sell. Add the codes and other names your customers use for them.</p>
        </div>
        <span className="pg-counter">{products.length} of {MAX_PRODUCTS}</span>
      </header>
      {products.length > 0 && (
        <ul className="pg-products">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} error={problems.products?.[product.id]} onChange={onChange} onRemove={onRemove} />
          ))}
        </ul>
      )}
      {problems.list && <p className="field-error" role="alert">{problems.list}</p>}
      <div className="pg-card-foot">
        <Button icon={Plus} onClick={onAdd} disabled={!canAdd}>{canAdd ? "Add a product" : `Limit of ${MAX_PRODUCTS} reached`}</Button>
      </div>
    </section>
  );
}
