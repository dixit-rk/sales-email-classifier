import { ChartNoAxesColumn, CircleAlert, FlaskConical, Inbox, LayoutDashboard, Settings } from "lucide-react";
import { ROUTES } from "../../shared/routes";
import { AnalyticsPreview } from "./previews/AnalyticsPreview";
import { CatalogPreview } from "./previews/CatalogPreview";
import { InboxPreview } from "./previews/InboxPreview";
import { OverviewPreview } from "./previews/OverviewPreview";
import { ReviewPreview } from "./previews/ReviewPreview";
import { SettingsPreview } from "./previews/SettingsPreview";

export const GUIDE_CARDS = [
  {
    id: "overview",
    title: "Overview",
    headline: "Your day at a glance",
    what: "A quick summary of your customer requests: how many arrived, how many are new, how many we matched to your products, and which products people ask for most.",
    helps: "Open it first thing in the morning to see what needs your attention. Click the activity chart or the product list to see more detail.",
    to: ROUTES.overview,
    icon: LayoutDashboard,
    Preview: OverviewPreview,
  },
  {
    id: "inbox",
    title: "Pricing inbox",
    headline: "Every price request in one place",
    what: "All the emails where a customer asked for a price. Each one shows who wrote, which product they want and how much, so you don’t have to read through your whole inbox.",
    helps: "Search, sort and filter the list, open a request to read it, and mark it read or unread. New requests appear on their own, with no need to refresh the page.",
    to: ROUTES.inbox,
    icon: Inbox,
    Preview: InboxPreview,
  },
  {
    id: "review",
    title: "Needs review",
    headline: "A quick check when we’re not sure",
    what: "Sometimes an email is unclear, like “I need some acid”. Instead of guessing, we put it here for you.",
    helps: "Read the email, then approve it as a price request or dismiss it. Nothing gets lost, and you always have the final say.",
    to: ROUTES.review,
    icon: CircleAlert,
    Preview: ReviewPreview,
  },
  {
    id: "analytics",
    title: "Analytics",
    headline: "See how things are going",
    what: "Charts and numbers for any period you choose: last week, this year, or your own dates.",
    helps: "Spot your busiest days, see which products are in demand, and download a report to share with your team.",
    to: ROUTES.analytics,
    icon: ChartNoAxesColumn,
    Preview: AnalyticsPreview,
  },
  {
    id: "catalog",
    title: "Product catalog",
    headline: "Teach us your products",
    what: "The list of products you sell, with their item codes and the other names customers use for them.",
    helps: "The better this list is, the better we recognise what customers ask for. Add products one by one, or upload an Excel sheet with many at once. A ready-made template is included.",
    to: ROUTES.catalog,
    icon: FlaskConical,
    Preview: CatalogPreview,
  },
  {
    id: "settings",
    title: "Settings",
    headline: "Keep Gmail connected",
    what: "Shows whether your Gmail is connected, and lets you choose the label we put on price requests in your Gmail.",
    helps: "If the connection ever expires you’ll see it here, with a button to reconnect, so you never miss a request. Change the label to match how your team organises email.",
    to: ROUTES.settings,
    icon: Settings,
    Preview: SettingsPreview,
  },
];

export const HOW_IT_WORKS = [
  { title: "A customer emails you", text: "Price requests arrive in your Gmail, just like always." },
  { title: "We spot the price requests", text: "ChemQuote reads each email, finds the product and amount, and marks the request in Gmail." },
  { title: "You reply faster", text: "Everything is waiting in your Pricing inbox, and unclear emails wait for a quick check." },
];
