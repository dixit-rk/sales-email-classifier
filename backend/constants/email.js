const VIEWS = { INBOX: "inbox", REVIEW: "review" };
const READ_FILTERS = ["all", "unread", "read"];
const SORT_FIELDS = { receivedAt: "receivedAt", from: "from", subject: "subject" };
const SORT_ORDERS = { asc: 1, desc: -1 };
const REVIEW_DECISIONS = { APPROVED: "approved", DISMISSED: "dismissed" };
const SELECTION_MODES = { IDS: "ids", ALL: "all" };

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_SEARCH_LENGTH = 100;
const MAX_SELECTED_IDS = 1000;
const SNIPPET_LENGTH = 160;
const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

module.exports = {
    VIEWS,
    READ_FILTERS,
    SORT_FIELDS,
    SORT_ORDERS,
    REVIEW_DECISIONS,
    SELECTION_MODES,
    DEFAULT_PAGE,
    DEFAULT_LIMIT,
    MAX_LIMIT,
    MAX_SEARCH_LENGTH,
    MAX_SELECTED_IDS,
    SNIPPET_LENGTH,
    OBJECT_ID_PATTERN
};
