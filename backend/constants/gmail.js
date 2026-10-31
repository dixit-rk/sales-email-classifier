const DEFAULT_LABEL_NAME = "pricing query";

const LABEL_LIMITS = {
    MAX_NAME_LENGTH: 60
};

const GMAIL_TIMEOUT_MS = 10000;

// Names Gmail reserves for its own labels; it rejects them (and CATEGORY_*) with "Invalid label name".
const RESERVED_LABEL_NAMES = [
    "inbox", "sent", "draft", "drafts", "trash", "spam", "starred", "unread", "important",
    "chat", "chats", "scheduled", "snoozed", "all mail", "bin", "junk"
];

const DAY_MS = 24 * 60 * 60 * 1000;
// Gmail ends a watch after about seven days; it is renewed once less than this much time is left.
const WATCH_RENEW_WITHIN_MS = 2 * DAY_MS;
const WATCH_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;
const WATCH_BATCH_LIMIT = 500;

const CONNECTION_STATUS = {
    CONNECTED: "connected",
    EXPIRED: "expired",
    UNAVAILABLE: "unavailable"
};

module.exports = {
    DEFAULT_LABEL_NAME,
    LABEL_LIMITS,
    GMAIL_TIMEOUT_MS,
    WATCH_RENEW_WITHIN_MS,
    WATCH_CHECK_INTERVAL_MS,
    WATCH_BATCH_LIMIT,
    RESERVED_LABEL_NAMES,
    CONNECTION_STATUS
};
