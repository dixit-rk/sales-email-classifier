import { bucketTitle } from "./chartScale";

const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;

/** Downloads the analytics numbers for the selected range as a CSV file generated in the browser. */
export function exportStatsCsv(analytics, cards) {
  const { range, series, products } = analytics;
  const rows = [
    ["Range", `${range.from} to ${range.to}`],
    ["Grouped by", range.granularity],
    [],
    ["Metric", "Value"],
    ...cards.map((card) => [card.label, card.value]),
    [],
    ["Period", "Inquiries"],
    ...series.map((bucket) => [bucketTitle(bucket.key, range.granularity), bucket.count]),
    [],
    ["Product", "Mentions", "Share %"],
    ...products.map((product) => [product.name, product.count, product.percent]),
  ];

  const csv = rows.map((row) => row.map(quote).join(",")).join("\n");
  const link = document.createElement("a");

  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `chemquote-analytics-${range.from}-to-${range.to}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
