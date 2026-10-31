const crypto = require("crypto");
const net = require("net");
const { DEVICE_ID_PATTERN, IPV6_PREFIX_HEXTETS } = require("../constants/playground");
const { invalid } = require("./queryParams");

const MAPPED_IPV4_PREFIX = "::ffff:";
const HEXTETS_IN_IPV6 = 8;

const hextets = (part) => (part ? part.split(":") : []);

function expandIPv6(address) {
    const [withoutZone] = address.split("%");
    const [head, tail] = withoutZone.split("::");
    const start = hextets(head);
    const end = hextets(tail);
    const missing = HEXTETS_IN_IPV6 - start.length - end.length;

    return [...start, ...(tail === undefined ? [] : Array(missing).fill("0")), ...end].map((part) => part.toLowerCase());
}

/**
 * The network a request comes from. IPv4 stays as is; IPv6 is reduced to its /64 prefix because a household or
 * device can hold many addresses inside it. Anything unreadable becomes "unknown" (and so shares one counter).
 */
function normalizeIp(raw) {
    const ip = String(raw ?? "").trim();

    if (ip.toLowerCase().startsWith(MAPPED_IPV4_PREFIX) && net.isIPv4(ip.slice(MAPPED_IPV4_PREFIX.length))) {
        return ip.slice(MAPPED_IPV4_PREFIX.length);
    }

    if (net.isIPv4(ip)) return ip;

    if (net.isIPv6(ip.split("%")[0])) return `${expandIPv6(ip).slice(0, IPV6_PREFIX_HEXTETS).join(":")}::/64`;

    return "unknown";
}

/** Keyed hash of an identifier, so stored counters cannot be turned back into IP addresses or device ids. */
function hashIdentifier(scope, value, secret) {
    return crypto.createHmac("sha256", secret).update(`${scope}:${value}`).digest("hex");
}

/** Reads the device id (a SHA-256 hex digest computed in the browser) from the request headers. */
function parseDeviceId(value) {
    const id = String(value ?? "").toLowerCase();

    if (!DEVICE_ID_PATTERN.test(id)) throw invalid("Could not identify this device. Reload the page and try again.");

    return id;
}

module.exports = { normalizeIp, hashIdentifier, parseDeviceId };
