const { PLAYGROUND_LIMITS: LIMITS } = require("../constants/playground");
const { invalid } = require("./queryParams");
const { parseProduct } = require("./catalogInput");
const { termKinds } = require("../services/catalogService");

const text = (value, name, maxLength, { required = false } = {}) => {
    const clean = typeof value === "string" ? value.trim() : "";

    if (required && !clean) throw invalid(`${name} is required`);
    if (clean.length > maxLength) throw invalid(`${name} must be at most ${maxLength} characters`);

    return clean;
};

function parsePlaygroundProducts(list) {
    if (!Array.isArray(list) || list.length === 0 || list.length > LIMITS.MAX_PRODUCTS) {
        throw invalid(`Add between 1 and ${LIMITS.MAX_PRODUCTS} products`);
    }

    const owners = new Map();

    return list.map((raw, index) => {
        const product = parseProduct(raw);

        if (product.aliases.length > LIMITS.MAX_ALIASES) throw invalid(`A product can have at most ${LIMITS.MAX_ALIASES} aliases`);
        if (product.aliases.some((alias) => alias.length > LIMITS.MAX_ALIAS_LENGTH)) throw invalid(`An alias can be at most ${LIMITS.MAX_ALIAS_LENGTH} characters`);

        for (const term of termKinds(product).keys()) {
            if (owners.has(term) && owners.get(term) !== index) {
                throw invalid(`"${term}" is used by more than one product. Give each product its own name, code and aliases`);
            }
            owners.set(term, index);
        }

        return product;
    });
}

/** Validates the playground request: 1-6 products and one email, all within small size limits. */
function parsePlaygroundRequest(body) {
    return {
        products: parsePlaygroundProducts(body?.products),
        email: {
            subject: text(body?.email?.subject, "Subject", LIMITS.MAX_SUBJECT_LENGTH),
            body: text(body?.email?.body, "Email text", LIMITS.MAX_BODY_LENGTH, { required: true })
        }
    };
}

module.exports = { parsePlaygroundRequest };
