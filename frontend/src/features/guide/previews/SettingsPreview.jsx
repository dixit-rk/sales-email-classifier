/** Miniature Settings: the Gmail connection shows as healthy and the label is changed. */
export function SettingsPreview() {
  return (
    <div className="m-settings">
      <div className="m-card m-conn">
        <div className="m-chead"><span className="m-ic" /><span className="m-line w60" /></div>
        <span className="m-pill ok"><i className="m-ping" /> Connected</span>
        <span className="m-line w80" />
      </div>
      <div className="m-card m-lbl">
        <div className="m-chead"><span className="m-ic" /><span className="m-line w50" /></div>
        <div className="m-chipwrap"><span className="m-chip a">pricing query</span><span className="m-chip b">Quotes</span></div>
        <span className="m-btn primary m-save">Save</span>
      </div>
    </div>
  );
}
