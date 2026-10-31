import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { bucketLabel, bucketTitle, labelStride, niceScale } from "../lib/chartScale";

const MAX_LABELS = 10;
const MAX_LABELS_NARROW = 5;
const WEEKDAY_LABEL_MAX_BUCKETS = 7;
const MIN_VISIBLE_PERCENT = 2;
const TIP_EDGE_BUCKETS = 2;

const tipSide = (index, count) => {
  if (index < TIP_EDGE_BUCKETS) return "tip-start";
  return index >= count - TIP_EDGE_BUCKETS ? "tip-end" : "";
};

/** Bar chart of inquiries per day, week or month with a numbered y-axis and an x-axis that thins its labels; `compact` makes it shorter for dashboards. */
export function TrendChart({ series, granularity, compact = false }) {
  const narrow = useMediaQuery("(max-width: 600px)");
  const max = Math.max(...series.map((bucket) => bucket.count));
  const { top, ticks } = niceScale(max);
  const stride = labelStride(series.length, narrow ? MAX_LABELS_NARROW : MAX_LABELS);
  const labelOptions = {
    weekdays: series.length <= WEEKDAY_LABEL_MAX_BUCKETS,
    spansYears: series[0].key.slice(0, 4) !== series[series.length - 1].key.slice(0, 4),
  };
  const columns = { gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))` };

  return (
    <div className={`trend ${compact ? "compact" : ""}`} role="group" aria-label="Inquiries over time">
      <div className="trend-axis" aria-hidden="true">
        {ticks.map((tick) => (
          <span key={tick} style={{ bottom: `${(tick / top) * 100}%` }}>{tick}</span>
        ))}
      </div>
      <div className="trend-plot">
        {ticks.map((tick) => (
          <span key={tick} className="trend-grid" style={{ bottom: `${(tick / top) * 100}%` }} aria-hidden="true" />
        ))}
        <div className="trend-bars" style={columns}>
          {series.map((bucket, index) => (
            <div
              key={bucket.key}
              className={`trend-column ${tipSide(index, series.length)}`}
              tabIndex={0}
              role="img"
              aria-label={`${bucketTitle(bucket.key, granularity)}: ${bucket.count} inquiries`}
            >
              <div
                className={`trend-bar ${bucket.count === max && max > 0 ? "peak" : ""}`}
                style={{ height: bucket.count === 0 ? 0 : `${Math.max(MIN_VISIBLE_PERCENT, (bucket.count / top) * 100)}%` }}
              >
                <span className="trend-tip">
                  <span><strong>{bucket.count}</strong> {bucket.count === 1 ? "inquiry" : "inquiries"}</span>
                  <small>{bucketTitle(bucket.key, granularity)}</small>
                </span>
              </div>
            </div>
          ))}
        </div>
        {max === 0 && <p className="trend-empty">No inquiries in this period</p>}
      </div>
      <div className="trend-labels" style={columns} aria-hidden="true">
        {series.map((bucket, index) => (
          <span key={bucket.key}>{index % stride === 0 ? bucketLabel(bucket.key, granularity, labelOptions) : ""}</span>
        ))}
      </div>
    </div>
  );
}
