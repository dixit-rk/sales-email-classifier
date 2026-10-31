import { EmptyState } from "../../../shared/ui";

/** Most requested products ranked by mentions (bars are relative to the top product, the figure is the share of all mentions); `showCount` adds the number of mentions. */
export function ProductDemand({ products, showCount = false }) {
  if (products.length === 0) return <EmptyState title="No products requested yet" />;

  const topCount = products[0].count;

  return products.map((product) => (
    <div className="product-row demand-row" key={product.name}>
      <div>
        <b>{product.name}</b>{showCount && <small className="product-count"> · {product.count} {product.count === 1 ? "mention" : "mentions"}</small>}
        <div style={{ marginTop: 8 }} className="progress"><div style={{ width: `${(product.count / topCount) * 100}%` }} /></div>
      </div>
      <small>{product.percent}%</small>
    </div>
  ));
}
