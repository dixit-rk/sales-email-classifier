export const VIEWS = { inbox: "inbox", review: "review" };

const BASE_DEFAULTS = { search: "", read: "all", sort: "receivedAt", order: "desc", page: "1", id: "" };

/** URL defaults per list: the inbox shows 10 rows per page (it scrolls inside its own panel), the review queue 20. */
export const LIST_DEFAULTS = {
  [VIEWS.inbox]: { ...BASE_DEFAULTS, limit: "10" },
  [VIEWS.review]: { ...BASE_DEFAULTS, limit: "20" },
};

export const READ_TABS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export const SORT_OPTIONS = [
  { value: "receivedAt:desc", label: "Newest first" },
  { value: "receivedAt:asc", label: "Oldest first" },
  { value: "from:asc", label: "Sender A–Z" },
  { value: "from:desc", label: "Sender Z–A" },
  { value: "subject:asc", label: "Subject A–Z" },
];

export const UNCLEAR_PRODUCT = "Unclear product";
