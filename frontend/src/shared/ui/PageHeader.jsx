/** Eyebrow, title and subtitle block at the top of a page; `actions` sit on the right. */
export function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="pagehead">
      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
        <h1>{title}</h1>
        <div className="sub">{subtitle}</div>
      </div>
      {actions}
    </div>
  );
}
