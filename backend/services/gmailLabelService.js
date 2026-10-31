const { getGmailClient } = require("./gmailService");
const { DEFAULT_LABEL_NAME, GMAIL_TIMEOUT_MS } = require("../constants/gmail");

const REQUEST_OPTIONS = { timeout: GMAIL_TIMEOUT_MS };

/** The Gmail label this user wants on pricing threads; users who never changed it get the default. */
const getLabelName = (user) => user.labelName || DEFAULT_LABEL_NAME;

/** Makes sure the label exists in Gmail (matching names the way Gmail does, ignoring case) and returns its id. */
async function ensureLabel(gmail, name) {
    const { data } = await gmail.users.labels.list({ userId: "me" }, REQUEST_OPTIONS);
    const existing = (data.labels || []).find((label) => label.name.toLowerCase() === name.toLowerCase());

    if (existing) return { id: existing.id, created: false };

    const { data: label } = await gmail.users.labels.create(
        {
            userId: "me",
            requestBody: {
                name,
                labelListVisibility: "labelShow",
                messageListVisibility: "show"
            }
        },
        REQUEST_OPTIONS
    );

    return { id: label.id, created: true };
}

/** Creates the user's label in Gmail (used at sign-in so it exists before the first email). */
async function ensureConfiguredLabel(user) {
    await ensureLabel(getGmailClient(user), getLabelName(user));
}

/** A thread is labelled only for a pricing query that needs no review and mentions at least one catalog product. */
const qualifiesForLabel = (email) =>
    email.isPricingQuery === true &&
    email.needsReview === false &&
    email.products.some((product) => product.in_catalog === true);

async function labelPricingThread(user, email) {
    if (!qualifiesForLabel(email) || !email.threadId) {
        return false;
    }

    const gmail = getGmailClient(user);
    const { id } = await ensureLabel(gmail, getLabelName(user));

    await gmail.users.threads.modify(
        {
            userId: "me",
            id: email.threadId,
            requestBody: { addLabelIds: [id] }
        },
        REQUEST_OPTIONS
    );

    console.log("Pricing label applied:", email.threadId);

    return true;
}

module.exports = { labelPricingThread, qualifiesForLabel, ensureLabel, ensureConfiguredLabel, getLabelName };
