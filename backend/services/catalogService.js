const mongoose = require("mongoose");
const Product = require("../models/Product");
const {
    CATALOG_LIMITS,
    CATALOG_SORT_FIELDS,
    PROMPT_CATALOG_LIMIT,
    PROMPT_CANDIDATE_LIMIT,
    MAX_NGRAM_WORDS,
    MAX_NGRAMS,
    NGRAM_SOURCE_LENGTH
} = require("../constants/catalog");
const { SORT_ORDERS } = require("../constants/email");
const { HttpError } = require("../utils/httpError");
const { normalizeTerm, compact, findMatch } = require("../utils/catalogMatcher");
const { parseAliases } = require("../utils/catalogInput");

const NOT_FOUND = 404;
const CONFLICT = 409;
const DUPLICATE_KEY = 11000;

const toObjectId = (id) => new mongoose.Types.ObjectId(id);
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toItem = (product) => ({
    id: String(product._id),
    name: product.name,
    itemCode: product.itemCode ?? "",
    formula: product.formula,
    aliases: product.aliases,
    createdAt: product.createdAt
});

/** Every normalized wording that identifies a product (name, item code with and without separators, formula, aliases) and which field it came from. */
function termKinds({ name, itemCode = "", formula = "", aliases = [] }) {
    const kinds = new Map();
    const add = (text, kind) => {
        const term = normalizeTerm(text);

        if (term && !kinds.has(term)) kinds.set(term, kind);
    };

    add(name, "name");
    add(itemCode, "item code");
    add(compact(normalizeTerm(itemCode)), "item code");
    add(formula, "formula");
    aliases.forEach((alias) => add(alias, "alias"));

    return kinds;
}

const termsOf = (product) => [...termKinds(product).keys()];

/** Finds another product that already uses one of these names, aliases or formulas. */
async function findConflict(userId, terms, exceptId) {
    const filter = { userId: toObjectId(userId), normalizedTerms: { $in: terms } };

    if (exceptId) filter._id = { $ne: exceptId };

    const other = await Product.findOne(filter).lean();

    if (!other) return null;

    const shared = terms.find((term) => other.normalizedTerms.includes(term));

    return `"${shared}" is already used by ${other.name}`;
}

async function assertRoom(userId) {
    if ((await Product.countDocuments({ userId: toObjectId(userId) })) >= CATALOG_LIMITS.MAX_PRODUCTS) {
        throw new HttpError(CONFLICT, `The catalog can hold at most ${CATALOG_LIMITS.MAX_PRODUCTS} products`);
    }
}

/** Adds a product; rejects a name, alias or formula that another product already uses. */
async function createProduct(userId, input) {
    const terms = termsOf(input);
    const conflict = await findConflict(userId, terms);

    if (conflict) throw new HttpError(CONFLICT, conflict);

    await assertRoom(userId);

    try {
        const product = await Product.create({
            ...input,
            userId,
            normalizedName: normalizeTerm(input.name),
            normalizedTerms: terms
        });

        return toItem(product);
    } catch (error) {
        if (error.code === DUPLICATE_KEY) throw new HttpError(CONFLICT, "A product with this name already exists");
        throw error;
    }
}

/** Merges new details into an existing product (aliases are added, the formula is replaced when given). */
async function updateProduct(userId, product, input) {
    const aliases = parseAliases([...product.aliases, ...input.aliases], product.name);
    const merged = {
        name: product.name,
        itemCode: input.itemCode || product.itemCode || "",
        formula: input.formula || product.formula,
        aliases
    };
    const terms = termsOf(merged);
    const conflict = await findConflict(userId, terms, product._id);

    if (conflict) throw new HttpError(CONFLICT, conflict);

    await Product.updateOne({ _id: product._id }, { $set: { ...merged, normalizedTerms: terms } });
}

/** The existing product with the same normalized name, if any. */
const findByName = (userId, name) =>
    Product.findOne({ userId: toObjectId(userId), normalizedName: normalizeTerm(name) }).lean();

/** One page of the catalog, searched and sorted in the database. */
async function listProducts(userId, { search, sortField, sortOrder, page, limit }) {
    const filter = { userId: toObjectId(userId) };

    if (search) {
        const pattern = { $regex: escapeRegex(search), $options: "i" };
        filter.$or = [{ name: pattern }, { itemCode: pattern }, { aliases: pattern }, { formula: pattern }];
    }

    const direction = SORT_ORDERS[sortOrder];
    const [rows, total] = await Promise.all([
        Product.find(filter)
            .sort({ [CATALOG_SORT_FIELDS[sortField]]: direction, _id: direction })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Product.countDocuments(filter)
    ]);

    return { data: rows.map(toItem), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

/** Deletes one of the user's products. */
async function deleteProduct(userId, productId) {
    const removed = await Product.findOneAndDelete({ _id: productId, userId: toObjectId(userId) });

    if (!removed) throw new HttpError(NOT_FOUND, "Product not found");
}

const wordNgrams = (text) => {
    const words = normalizeTerm(text.slice(0, NGRAM_SOURCE_LENGTH)).split(" ");
    const grams = new Set();

    for (let size = 1; size <= MAX_NGRAM_WORDS; size += 1) {
        for (let start = 0; start + size <= words.length && grams.size < MAX_NGRAMS; start += 1) {
            grams.add(words.slice(start, start + size).join(" "));
        }
    }

    return [...grams];
};

const promptLine = (product) => {
    const details = [];

    if (product.itemCode) details.push(`item code ${product.itemCode}`);
    if (product.aliases.length) details.push(`also called: ${product.aliases.join(", ")}`);
    if (product.formula) details.push(`formula ${product.formula}`);

    return `- ${product.name}${details.length ? ` (${details.join("; ")})` : ""}`;
};

/** The catalog section of the AI prompt for a list of products `{ name, itemCode, formula, aliases }`. */
const formatCatalogPrompt = (products) => `Company product catalog:\n${products.map(promptLine).join("\n")}`;

/**
 * The catalog section of the AI prompt. A catalog of up to PROMPT_CATALOG_LIMIT products is listed in full;
 * a larger one lists only the products whose names or aliases appear in the email.
 */
async function buildCatalogPrompt(userId, emailText) {
    const owner = toObjectId(userId);
    const count = await Product.countDocuments({ userId: owner });

    if (count === 0) return "The company catalog is currently empty, so every product is out of catalog.";

    if (count <= PROMPT_CATALOG_LIMIT) {
        const products = await Product.find({ userId: owner }).sort({ normalizedName: 1 }).lean();

        return formatCatalogPrompt(products);
    }

    const candidates = await Product.find({ userId: owner, normalizedTerms: { $in: wordNgrams(emailText) } })
        .limit(PROMPT_CANDIDATE_LIMIT)
        .lean();

    return [
        "Company product catalog (large: only the entries that appear in this email are listed;",
        "a product that is not listed here may still exist in the catalog):",
        candidates.length ? candidates.map(promptLine).join("\n") : "(no catalog product is mentioned by name)"
    ].join("\n");
}

/** Which field of the matched entry the customer's wording hit ("name", "alias", "item code" or "formula"), when known. */
function matchedVia(entry, raw) {
    const term = normalizeTerm(raw);

    return entry.kinds?.get(term) ?? entry.kinds?.get(compact(term));
}

/**
 * Checks the products the AI found against catalog entries `{ id, name, terms, kinds? }` by exact name, alias,
 * item code or formula. The catalog decides `in_catalog`, not the AI; a wording shared by two entries needs a human decision.
 */
function matchAgainstCatalog(entries, result) {
    let ambiguous = null;

    const products = result.products.map((product) => {
        const raw = findMatch(product.normalized_name, entries) ? product.normalized_name : product.mentioned_name;
        const found = findMatch(raw, entries);

        if (found?.kind === "ambiguous") ambiguous = product.mentioned_name;

        if (found?.kind !== "exact") return { ...product, in_catalog: false };

        // Describe the match by what the customer wrote when possible, not by the AI's rewritten name
        const via = matchedVia(found.entry, product.mentioned_name) ?? matchedVia(found.entry, raw);

        return { ...product, normalized_name: found.entry.name, in_catalog: true, ...(via ? { matched_via: via } : {}) };
    });

    return {
        products,
        needsReview: result.needs_review || ambiguous !== null,
        reason: ambiguous ? `${result.reason} "${ambiguous}" matches more than one catalog product.` : result.reason
    };
}

/** Checks the products the AI found against the user's catalog in the database. */
async function applyCatalog(userId, result) {
    const products = await Product.find({ userId: toObjectId(userId) }).select("name normalizedTerms").lean();

    return matchAgainstCatalog(
        products.map((product) => ({ id: String(product._id), name: product.name, terms: product.normalizedTerms })),
        result
    );
}

module.exports = {
    createProduct,
    updateProduct,
    findByName,
    listProducts,
    deleteProduct,
    buildCatalogPrompt,
    applyCatalog,
    termKinds,
    formatCatalogPrompt,
    matchAgainstCatalog
};
