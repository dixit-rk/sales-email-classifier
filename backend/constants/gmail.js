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

const CONNECTION_STATUS = {
    CONNECTED: "connected",
    EXPIRED: "expired",
    UNAVAILABLE: "unavailable"
};

module.exports = {
    DEFAULT_LABEL_NAME,
    LABEL_LIMITS,
    GMAIL_TIMEOUT_MS,
    RESERVED_LABEL_NAMES,
    CONNECTION_STATUS
};
