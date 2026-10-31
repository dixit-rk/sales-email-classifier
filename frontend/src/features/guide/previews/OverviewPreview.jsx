import { Cursor } from "./Cursor";

const BARS = [40, 65, 50, 85, 70, 95, 60];

/** Miniature Overview: numbers pop, the list slides in, the chart grows and the pointer opens the chart. */
export function OverviewPreview() {
  return (
    <div className="m-overview">
      <div className="m-stats">
        {[0, 1, 2, 3].map((i) => (
          <div className="m-card m-stat" style={{ "--i": i }} key={i}><span className="m-line w60" /><span className="m-num" /></div>
        ))}
      </div>
      <div className="m-split">
        <div className="m-card m-rows">
          {[0, 1, 2].map((i) => (
            <div className="m-row" style={{ "--i": i }} key={i}>
              <span className="m-avatar" /><div className="m-stack"><span className="m-line w80" /><span className="m-line w50" /></div>
            </div>
          ))}
        </div>
        <div className="m-card m-chart m-target">
          {BARS.map((height, i) => <span key={i} className={`m-bar ${i === 5 ? "hot" : ""}`} style={{ height: `${height}%`, "--i": i }} />)}
        </div>
      </div>
      <Cursor className="cursor-overview" />
    </div>
  );
}
