const User = require("../models/User");
const { getGmailClient } = require("./gmailService");
const { ensureLabel } = require("./gmailLabelService");
const { ensureWatch, isWatchActive } = require("./gmailWatchService");
const { GMAIL_TIMEOUT_MS, CONNECTION_STATUS } = require("../constants/gmail");
const { HttpError } = require("../utils/httpError");
const { isGmailAuthError } = require("../utils/gmailErrors");

const BAD_REQUEST = 400;
const CONFLICT = 409;
const RECONNECT_MESSAGE = "Your Gmail connection has expired. Reconnect it in the Gmail connection card first.";

/**
 * Asks Google right now whether the stored credentials still work (never cached) and records the result.
 * Returns `expired` when Google refuses them, `unavailable` when Google could not be reached.
 */
async function checkConnection(user) {
    const checkedAt = new Date().toISOString();

    try {
        const { data } = await getGmailClient(user).users.getProfile({ userId: "me" }, { timeout: GMAIL_TIMEOUT_MS });

        await User.updateOne({ _id: user._id }, { $set: { gmailConnected: true } });

        // A valid token is not enough: Gmail must also be set to notify us. Start it here if it is missing.
        try {
            await ensureWatch(user);
        } catch (watchError) {
            console.error("Gmail watch could not be started:", watchError.message);
        }

        return { status: CONNECTION_STATUS.CONNECTED, email: data.emailAddress, checkedAt, watching: isWatchActive(user) };
    } catch (error) {
        if (!isGmailAuthError(error)) return { status: CONNECTION_STATUS.UNAVAILABLE, checkedAt };

        await User.updateOne({ _id: user._id }, { $set: { gmailConnected: false } });

        return { status: CONNECTION_STATUS.EXPIRED, checkedAt };
    }
}

async function createInGmail(user, name) {
    try {
        return await ensureLabel(getGmailClient(user), name);
    } catch (error) {
        if (isGmailAuthError(error)) throw new HttpError(CONFLICT, RECONNECT_MESSAGE);
        if (error.code === BAD_REQUEST) throw new HttpError(BAD_REQUEST, `Gmail does not accept the label name "${name}"`);
        throw error;
    }
}

/**
 * Replaces the label put on pricing threads and creates it in Gmail if it does not exist there yet.
 * Threads that already carry the old label keep it.
 */
async function replaceLabel(user, name) {
    const { created } = await createInGmail(user, name);

    await User.updateOne({ _id: user._id }, { $set: { labelName: name } });

    return { name, createdInGmail: created };
}

module.exports = { checkConnection, replaceLabel };
