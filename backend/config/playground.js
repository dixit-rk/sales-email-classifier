const {
    DEFAULT_REQUESTS_PER_DEVICE,
    DEFAULT_REQUESTS_PER_NETWORK,
    DEFAULT_DAILY_CAP
} = require("../constants/playground");

const readCount = (name, fallback) => {
    const value = Number(process.env[name]);

    return Number.isInteger(value) && value >= 0 ? value : fallback;
};

/** Playground limits and identity settings, read from the environment when needed. */
module.exports = {
    requestsPerDevice: () => readCount("PLAYGROUND_LIMIT_PER_DEVICE", DEFAULT_REQUESTS_PER_DEVICE),
    requestsPerNetwork: () => readCount("PLAYGROUND_LIMIT_PER_IP", DEFAULT_REQUESTS_PER_NETWORK),
    dailyCap: () => readCount("PLAYGROUND_DAILY_CAP", DEFAULT_DAILY_CAP),
    hashSecret: () => process.env.PLAYGROUND_HASH_SECRET || process.env.SESSION_SECRET,
    trustedProxyHops: () => readCount("TRUST_PROXY_HOPS", 0)
};
