const PlaygroundUsage = require("../models/PlaygroundUsage");
const config = require("../config/playground");
const { USAGE_SCOPES } = require("../constants/playground");
const { HttpError } = require("../utils/httpError");
const { hashIdentifier } = require("../utils/clientIdentity");

const TOO_MANY_REQUESTS = 429;
const DUPLICATE_KEY = 11000;

const LIMIT_MESSAGES = {
    [USAGE_SCOPES.DEVICE]: "You have used all of your free playground requests. Sign in with Google to use the full app.",
    [USAGE_SCOPES.NETWORK]: "You have used all of your free playground requests. Sign in with Google to use the full app.",
    [USAGE_SCOPES.DAY]: "The playground has reached its limit for today. Please try again tomorrow, or sign in with Google."
};

const dayKey = (now) => new Date(now).toISOString().slice(0, 10);

/**
 * The counters one request touches: the device, the network and a global daily cap. Device and network are
 * independent, so the same device on a new network, or a new device on the same network, shares a counter.
 */
function slotsFor({ deviceId, ip }, now) {
    const secret = config.hashSecret();

    return [
        { scope: USAGE_SCOPES.DEVICE, key: hashIdentifier("device", deviceId, secret), limit: config.requestsPerDevice() },
        { scope: USAGE_SCOPES.NETWORK, key: hashIdentifier("network", ip, secret), limit: config.requestsPerNetwork() },
        { scope: USAGE_SCOPES.DAY, key: dayKey(now), limit: config.dailyCap() }
    ];
}

/** Adds one to a counter only while it is below its limit; false when it is already full. Atomic in the database. */
async function take({ scope, key, limit }) {
    const now = new Date();

    try {
        await PlaygroundUsage.findOneAndUpdate(
            { scope, key, count: { $lt: limit } },
            { $inc: { count: 1 }, $set: { lastUsedAt: now }, $setOnInsert: { firstUsedAt: now } },
            { upsert: true }
        );

        return true;
    } catch (error) {
        // The counter exists and did not match the filter, so the insert collided: it is full.
        if (error.code === DUPLICATE_KEY) return false;
        throw error;
    }
}

/** Gives a counter back (used when the AI call fails, so a failed attempt does not cost the visitor a request). */
const release = ({ scope, key }) =>
    PlaygroundUsage.updateOne({ scope, key, count: { $gt: 0 } }, { $inc: { count: -1 } });

/** Uses up one request on every counter, or throws 429 and leaves all counters as they were. */
async function reserve(identity, now = Date.now()) {
    const slots = slotsFor(identity, now);
    const taken = [];

    for (const slot of slots) {
        if (slot.limit > 0 && (await take(slot))) {
            taken.push(slot);
        } else {
            await Promise.all(taken.map(release));
            throw new HttpError(TOO_MANY_REQUESTS, LIMIT_MESSAGES[slot.scope]);
        }
    }

    return slots;
}

/** How many requests this visitor can still make: the smallest amount left on any of their counters. */
async function getUsage(identity, now = Date.now()) {
    const slots = slotsFor(identity, now);
    const rows = await PlaygroundUsage.find({ $or: slots.map(({ scope, key }) => ({ scope, key })) }).lean();
    const used = (slot) => rows.find((row) => row.scope === slot.scope && row.key === slot.key)?.count ?? 0;
    const remaining = Math.min(...slots.map((slot) => Math.max(0, slot.limit - used(slot))));

    return { limit: config.requestsPerDevice(), remaining };
}

module.exports = { reserve, release, getUsage };
