import { ChartNoAxesColumn, CircleAlert, CircleHelp, FlaskConical, Inbox, LayoutDashboard, Settings } from "lucide-react";
import { ROUTES } from "../../shared/routes";

export const WORKSPACE_ITEMS = [
  { to: ROUTES.overview, label: "Overview", icon: LayoutDashboard },
  { to: ROUTES.inbox, label: "Pricing inbox", icon: Inbox, countKey: "inbox" },
  { to: ROUTES.review, label: "Needs review", icon: CircleAlert, countKey: "review" },
  { to: ROUTES.analytics, label: "Analytics", icon: ChartNoAxesColumn },
];

export const MANAGE_ITEMS = [
  { to: ROUTES.catalog, label: "Product catalog", icon: FlaskConical },
  { to: ROUTES.settings, label: "Settings", icon: Settings },
];

export const HELP_ITEM = { to: ROUTES.guide, label: "Help & support", icon: CircleHelp };

const MOBILE_LABELS = { [ROUTES.inbox]: "Inbox", [ROUTES.review]: "Review", [ROUTES.catalog]: "Catalog" };

export const MOBILE_ITEMS = [...WORKSPACE_ITEMS, ...MANAGE_ITEMS].map((item) => ({
  ...item,
  label: MOBILE_LABELS[item.to] ?? item.label,
}));

/** Label of the nav item for a path, used by the breadcrumb and placeholder pages. */
export const labelForPath = (pathname) =>
  [...WORKSPACE_ITEMS, ...MANAGE_ITEMS, HELP_ITEM].find((item) => item.to === pathname)?.label ?? "";
