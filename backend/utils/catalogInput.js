const { CATALOG_LIMITS, CATALOG_SORT_FIELDS } = require("../constants/catalog");
const { invalid, parsePositiveInt, pickOption } = require("./queryParams");
const { normalizeTerm } = require("./catalogMatcher");
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require("../constants/email");

const ALIAS_SEPARATOR = /[,;\n|]+/;

const parseText = (value, name, maxLength, { required = false } = {}) => {
    const text = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

    if (required && !text) throw invalid(`${name} is required`);

    if (text.length > maxLength) throw invalid(`${name} must be at most ${maxLength} characters`);

    return text;
};

/** Splits a cell or field of aliases on commas, semicolons, pipes or new lines. */
const splitAliases = (value) => String(value ?? "").split(ALIAS_SEPARATOR);

/** Cleans a list of aliases: trims, drops blanks and duplicates (ignoring case and punctuation) and enforces the limits. */
function parseAliases(value, productName) {
    const list = Array.isArray(value) ? value : splitAliases(value);
    const seen = new Set([normalizeTerm(productName)]);
    const aliases = [];

    for (const raw of list) {
        const alias = parseText(raw, "alias", CATALOG_LIMITS.MAX_ALIAS_LENGTH);
        const key = normalizeTerm(alias);

        if (key && !seen.has(key)) {
            seen.add(key);
            aliases.push(alias);
        }
    }

    if (aliases.length > CATALOG_LIMITS.MAX_ALIASES) {
        throw invalid(`A product can have at most ${CATALOG_LIMITS.MAX_ALIASES} aliases`);
    }

    return aliases;
}

/** Validates one product (from the add form or an Excel row). */
function parseProduct(input) {
    const name = parseText(input?.name, "name", CATALOG_LIMITS.MAX_NAME_LENGTH, { required: true });

    return {
        name,
        itemCode: parseText(input?.itemCode, "item code", CATALOG_LIMITS.MAX_ITEM_CODE_LENGTH),
        formula: parseText(input?.formula, "formula", CATALOG_LIMITS.MAX_FORMULA_LENGTH),
        aliases: parseAliases(input?.aliases, name)
    };
}

/** Validates the catalog list query: search, sort, page and page size (default 20, max 100). */
function parseCatalogQuery(query) {
    return {
        search: parseText(query.search, "search", CATALOG_LIMITS.MAX_SEARCH_LENGTH),
        sortField: pickOption(query.sort, Object.keys(CATALOG_SORT_FIELDS), "name", "sort"),
        sortOrder: pickOption(query.order, ["asc", "desc"], "asc", "order"),
        page: parsePositiveInt(query.page, DEFAULT_PAGE, "page"),
        limit: Math.min(parsePositiveInt(query.limit, DEFAULT_LIMIT, "limit"), MAX_LIMIT)
    };
}

module.exports = { parseProduct, parseAliases, splitAliases, parseCatalogQuery };
