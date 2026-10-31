const { classifyEmail } = require("./geminiService");
const { termKinds, formatCatalogPrompt, matchAgainstCatalog } = require("./catalogService");
const { qualifiesForLabel } = require("./gmailLabelService");
const { reserve, release, getUsage } = require("./playgroundQuotaService");
const { HttpError } = require("../utils/httpError");

const BAD_GATEWAY = 502;
const AI_FAILED_MESSAGE = "The AI could not read this email right now. Please try again in a moment.";

/** Runs the same AI and catalog matching the real app uses, against the visitor's own product list. */
async function classify({ products, email }) {
    const entries = products.map((product, index) => {
        const kinds = termKinds(product);

        return { id: String(index), name: product.name, terms: [...kinds.keys()], kinds };
    });

    const aiResult = await classifyEmail(email, formatCatalogPrompt(products));
    const matched = matchAgainstCatalog(entries, aiResult);
    const found = matched.products.map((product) => ({
        mentionedName: product.mentioned_name,
        normalizedName: product.normalized_name,
        inCatalog: product.in_catalog,
        matchedVia: product.matched_via ?? null
    }));

    return {
        isPricingQuery: aiResult.is_pricing_query,
        needsReview: matched.needsReview,
        quantity: aiResult.quantity,
        reason: matched.reason,
        products: found,
        wouldLabel: qualifiesForLabel({
            isPricingQuery: aiResult.is_pricing_query,
            needsReview: matched.needsReview,
            products: matched.products
        })
    };
}

/**
 * Analyses one sample email for an anonymous visitor. A request is counted before the AI is called and
 * handed back if the AI fails; nothing from the request is stored.
 */
async function analyze(identity, input) {
    const slots = await reserve(identity);

    try {
        const result = await classify(input);

        return { result, usage: await getUsage(identity) };
    } catch (error) {
        await Promise.all(slots.map(release));
        console.error("Playground analysis failed:", error.message);

        throw new HttpError(BAD_GATEWAY, AI_FAILED_MESSAGE);
    }
}

module.exports = { analyze, getUsage };
