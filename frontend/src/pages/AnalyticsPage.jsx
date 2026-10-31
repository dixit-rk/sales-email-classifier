import { Download } from "lucide-react";
import { useMemo } from "react";
import {
  DEFAULT_RANGE, exportStatsCsv, formatDateKey, ProductDemand, RANGE_PERIOD, RangePicker,
  resolveRange, StatCards, toStatCards, TrendChart, useAnalytics,
} from "../features/stats";
import { useListParams } from "../shared/hooks/useListParams";
import { Button, ErrorState, LoadingState, PageHeader } from "../shared/ui";

const RANGE_DEFAULTS = { range: DEFAULT_RANGE, from: "", to: "" };

/** Analytics for a chosen date range: headline numbers, trend chart, product demand and a CSV export. */
export default function AnalyticsPage() {
  const { params, update } = useListParams(RANGE_DEFAULTS);
  const resolved = useMemo(() => resolveRange(params), [params]);
  const { data, error, loading, reload } = useAnalytics(resolved);

  return (
    <div className="content">
      <PageHeader
        eyebrow="PERFORMANCE"
        title="Analytics"
        subtitle="A clear picture of your inbound quotation opportunities."
        actions={
          <div className="analytics-toolbar">
            <RangePicker
              key={params.range}
              value={params}
              resolved={resolved}
              onChange={(next) => update({ from: "", to: "", ...next }, { resetPage: false })}
            />
            {data && (
              <Button icon={Download} onClick={() => exportStatsCsv(data, toStatCards(data.cards, RANGE_PERIOD))}>
                Export report
              </Button>
            )}
          </div>
        }
      />
      {error && <ErrorState message={error.message} onRetry={reload} />}
      {!error && !data && <LoadingState label="Loading analytics…" />}
      {data && !error && (
        <div aria-busy={loading} style={{ opacity: loading ? 0.6 : 1 }}>
          <StatCards cards={data.cards} period={RANGE_PERIOD} />
          <div className="layout">
            <section className="panel trend-panel allow-overflow">
              <div className="panel-head"><h3>Inquiries over time</h3></div>
              <div className="range-summary">
                {formatDateKey(data.range.from)} – {formatDateKey(data.range.to)}
              </div>
              <TrendChart series={data.series} granularity={data.range.granularity} />
            </section>
            <section className="panel">
              <div className="panel-head"><h3>Product demand</h3><span className="sub" style={{ fontSize: 11 }}>Top 10</span></div>
              <ProductDemand products={data.products} showCount />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
