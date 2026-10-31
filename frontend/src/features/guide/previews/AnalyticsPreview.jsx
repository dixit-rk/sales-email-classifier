const SEVEN = [30, 55, 45, 80, 60, 95, 50];
const TWELVE = [35, 50, 40, 65, 55, 80, 60, 90, 70, 85, 65, 95];

const Chart = ({ className, bars, axis }) => (
  <div className={`m-chartgroup ${className}`}>
    <div className="m-yaxis">{axis.map((tick) => <span key={tick}>{tick}</span>)}</div>
    <div className="m-bars">
      {bars.map((height, i) => <span key={i} className={`m-bar ${i === bars.length - 2 ? "hot" : ""}`} style={{ height: `${height}%` }} />)}
    </div>
  </div>
);

/** Miniature Analytics: the date range changes and the chart regroups to fit it. */
export function AnalyticsPreview() {
  return (
    <div className="m-analytics">
      <div className="m-range">
        <span className="m-pill a">Last 7 days</span>
        <span className="m-pill b">Last 12 months</span>
      </div>
      <div className="m-plot">
        <Chart className="a" bars={SEVEN} axis={[10, 5, 0]} />
        <Chart className="b" bars={TWELVE} axis={[40, 20, 0]} />
      </div>
    </div>
  );
}
