import { Cursor } from "./Cursor";

/** Miniature Pricing inbox: a new request arrives, the pointer opens one and its details fill in. */
export function InboxPreview() {
  return (
    <div className="m-inbox">
      <div className="m-list">
        <div className="m-item m-newrow"><i className="m-dot" /><div className="m-stack"><span className="m-line w70" /><span className="m-line w90" /></div></div>
        {[1, 2, 3].map((i) => (
          <div className={`m-item ${i === 1 ? "m-pick" : ""}`} key={i}><div className="m-stack"><span className="m-line w60" /><span className="m-line w80" /></div></div>
        ))}
      </div>
      <div className="m-detail">
        <span className="m-tag">Price request</span>
        {[90, 100, 70, 85].map((width, i) => <span key={i} className="m-line m-fill" style={{ width: `${width}%`, "--i": i }} />)}
      </div>
      <span className="m-toast">New request</span>
      <Cursor className="cursor-inbox" />
    </div>
  );
}
