const ROWS = [["w60", "AA-101"], ["w50", "SH-102"], ["w70", "CA-103"]];

/** Miniature Product catalog: a search is typed and a new product is added to the list. */
export function CatalogPreview() {
  return (
    <div className="m-catalog">
      <div className="m-top">
        <div className="m-searchbar"><span className="m-sicon" /><span className="m-type">PCFG</span></div>
        <span className="m-btn primary m-add">+ Add</span>
      </div>
      <div className="m-clist">
        <div className="m-crow m-newcrow"><span className="m-avatar" /><span className="m-line w60" /><span className="m-code">PCFG228</span></div>
        {ROWS.map(([width, code]) => (
          <div className="m-crow" key={code}><span className="m-avatar" /><span className={`m-line ${width}`} /><span className="m-code">{code}</span></div>
        ))}
      </div>
    </div>
  );
}
