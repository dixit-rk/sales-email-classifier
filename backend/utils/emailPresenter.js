const { SNIPPET_LENGTH } = require("../constants/email");

const SENDER_PATTERN = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/;

const parseSender = (from = "") => {
    const match = SENDER_PATTERN.exec(from);

    if (!match) return { fromName: from, fromEmail: from };

    return { fromName: match[1] || match[2], fromEmail: match[2] };
};

/** Maps an Email document or lean object to the list-item shape sent to clients. */
function toEmailItem(email) {
    const snippet = email.snippet ?? (email.body || "").slice(0, SNIPPET_LENGTH);

    return {
        id: String(email._id),
        threadId: email.threadId,
        ...parseSender(email.from),
        subject: email.subject,
        snippet,
        receivedAt: email.receivedAt,
        isRead: email.isRead === true,
        needsReview: email.needsReview === true,
        reviewDecision: email.reviewDecision ?? null,
        isPricingQuery: email.isPricingQuery === true,
        products: (email.products || []).map((product) => ({
            name: product.normalized_name,
            inCatalog: product.in_catalog
        })),
        quantity: email.quantity || "",
        reason: email.classificationReason || ""
    };
}

module.exports = { toEmailItem };
