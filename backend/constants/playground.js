const PLAYGROUND_LIMITS = {
    MAX_PRODUCTS: 6,
    MAX_NAME_LENGTH: 80,
    MAX_ITEM_CODE_LENGTH: 40,
    MAX_ALIASES: 5,
    MAX_ALIAS_LENGTH: 60,
    MAX_SUBJECT_LENGTH: 150,
    MAX_BODY_LENGTH: 2000
};

// Defaults; the first three can be changed with environment variables (see config/playground.js).
const DEFAULT_REQUESTS_PER_DEVICE = 15;
const DEFAULT_REQUESTS_PER_NETWORK = 15;
const DEFAULT_DAILY_CAP = 300;

const USAGE_SCOPES = { DEVICE: "device", NETWORK: "network", DAY: "day" };
const DEVICE_ID_PATTERN = /^[a-f0-9]{64}$/;
const IPV6_PREFIX_HEXTETS = 4;

module.exports = {
    PLAYGROUND_LIMITS,
    DEFAULT_REQUESTS_PER_DEVICE,
    DEFAULT_REQUESTS_PER_NETWORK,
    DEFAULT_DAILY_CAP,
    USAGE_SCOPES,
    DEVICE_ID_PATTERN,
    IPV6_PREFIX_HEXTETS
};
