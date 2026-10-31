import { useAuth } from "../features/auth";
import { RecentInquiries } from "../features/emails";
import { ProductDemand, StatCards, TrendChart, useStats } from "../features/stats";
import { useNow } from "../shared/hooks/useNow";
import { ROUTES } from "../shared/routes";
import { ErrorState, LinkPanel, LoadingState, PageHeader } from "../shared/ui";

const NOON = 12;
const EVENING = 18;

/** Good morning before noon, afternoon until 6 pm, then evening, by the browser's local time. */
const greeting = (hour) => (hour < NOON ? "Good morning" : hour < EVENING ? "Good afternoon" : "Good evening");

/** Overview: headline numbers, latest inquiries, weekly activity and top products. */
export default function OverviewPage() {
  const { data, error, reload } = useStats();
  const { user } = useAuth();
  const now = useNow();

  return (
    <div className="content">
      <PageHeader
        eyebrow={now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
        title={<>{greeting(now.getHours())}, {user.name} <span style={{ fontSize: 23 }}>✳</span></>}
        subtitle="Here's what needs your attention today."
      />
      {error && <ErrorState message={error.message} onRetry={reload} />}
      {!error && !data && <LoadingState label="Loading your numbers…" />}
      {data && (
        <>
          <StatCards cards={data.cards} />
          <div className="layout">
            <RecentInquiries />
            <div style={{ display: "grid", gap: 20 }}>
              <LinkPanel to={ROUTES.analytics} title="Inquiry activity" meta="Last 7 days" className="allow-overflow">
                <TrendChart series={data.activity.map((day) => ({ key: day.date, count: day.count }))} granularity="day" compact />
                <div className="chart-note">Pricing inquiries received per day</div>
              </LinkPanel>
              <LinkPanel to={ROUTES.analytics} title="Top requested products" meta="Top 10 · Last 7 days">
                <ProductDemand products={data.products} />
              </LinkPanel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
