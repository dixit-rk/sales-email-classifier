const User = require("../models/User");
const { startGmailWatch } = require("./gmailService");
const {
    WATCH_RENEW_WITHIN_MS,
    WATCH_CHECK_INTERVAL_MS,
    WATCH_BATCH_LIMIT
} = require("../constants/gmail");
const { isGmailTokenError } = require("../utils/gmailErrors");

const expiresAt = (user) => (user.gmailWatchExpiration ? new Date(user.gmailWatchExpiration).getTime() : 0);

/** True while Gmail is set to notify us about this user's new emails. */
const isWatchActive = (user, now = Date.now()) => expiresAt(user) > now;

/** True when there is no watch, or it ends soon enough that it should be renewed now. */
const needsWatch = (user, now = Date.now()) => expiresAt(user) - now < WATCH_RENEW_WITHIN_MS;

/** Starts or renews the Gmail watch when needed; resolves to whether it called Gmail. */
async function ensureWatch(user, now = Date.now()) {
    if (!needsWatch(user, now)) return false;

    await startGmailWatch(user);

    return true;
}

/** Renews every connected user's watch that is missing or about to end. Failures are logged per user. */
async function renewDueWatches(now = Date.now()) {
    const due = await User.find({
        gmailConnected: true,
        encryptedRefreshToken: { $exists: true, $ne: null },
        $or: [
            { gmailWatchExpiration: { $exists: false } },
            { gmailWatchExpiration: null },
            { gmailWatchExpiration: { $lt: new Date(now + WATCH_RENEW_WITHIN_MS) } }
        ]
    }).limit(WATCH_BATCH_LIMIT);

    let renewed = 0;

    for (const user of due) {
        try {
            await startGmailWatch(user);
            renewed += 1;
        } catch (error) {
            if (isGmailTokenError(error)) await User.updateOne({ _id: user._id }, { $set: { gmailConnected: false } });
            console.error("Gmail watch renewal failed:", error.message);
        }
    }

    return { checked: due.length, renewed };
}

/** Runs the renewal now and then every few hours for as long as the server runs. */
function startWatchRenewal() {
    const run = () => renewDueWatches().catch((error) => console.error("Gmail watch check failed:", error.message));

    run();

    return setInterval(run, WATCH_CHECK_INTERVAL_MS).unref();
}

module.exports = { isWatchActive, needsWatch, ensureWatch, renewDueWatches, startWatchRenewal };
