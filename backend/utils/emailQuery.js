const {
    VIEWS,
    READ_FILTERS,
    SORT_FIELDS,
    SORT_ORDERS,
    REVIEW_DECISIONS,
    SELECTION_MODES,
    DEFAULT_PAGE,
    DEFAULT_LIMIT,
    MAX_LIMIT,
    MAX_SEARCH_LENGTH,
    MAX_SELECTED_IDS,
    OBJECT_ID_PATTERN
} = require("../constants/email");

const { invalid, parsePositiveInt, pickOption } = require("./queryParams");

/** Validates the filter fields shared by listing and select-all bulk actions. */
function parseFilters(source = {}) {
    const search = String(source.search ?? "").trim();

    if (search.length > MAX_SEARCH_LENGTH) {
        throw invalid(`search must be at most ${MAX_SEARCH_LENGTH} characters`);
    }

    return {
        view: pickOption(source.view, Object.values(VIEWS), VIEWS.INBOX, "view"),
        read: pickOption(source.read, READ_FILTERS, "all", "read"),
        search
    };
}

/** Validates the query string of the email list endpoint. */
function parseListQuery(query) {
    return {
        filters: parseFilters(query),
        sortField: pickOption(
            query.sort,
            Object.keys(SORT_FIELDS),
            "receivedAt",
            "sort"
        ),
        sortOrder: pickOption(
            query.order,
            Object.keys(SORT_ORDERS),
            "desc",
            "order"
        ),
        page: parsePositiveInt(query.page, DEFAULT_PAGE, "page"),
        limit: Math.min(
            parsePositiveInt(query.limit, DEFAULT_LIMIT, "limit"),
            MAX_LIMIT
        )
    };
}

const parseIdList = (ids, name) => {
    if (!Array.isArray(ids) || ids.length > MAX_SELECTED_IDS) {
        throw invalid(`${name} must be an array of at most ${MAX_SELECTED_IDS} ids`);
    }

    if (!ids.every((id) => OBJECT_ID_PATTERN.test(id))) {
        throw invalid(`${name} contains an invalid id`);
    }

    return ids;
};

/** Validates a bulk selection: explicit ids, or every match of the filters minus exclusions. */
function parseSelection(selection) {
    if (selection?.mode === SELECTION_MODES.IDS) {
        return {
            mode: SELECTION_MODES.IDS,
            ids: parseIdList(selection.ids, "ids")
        };
    }

    if (selection?.mode === SELECTION_MODES.ALL) {
        return {
            mode: SELECTION_MODES.ALL,
            filters: parseFilters(selection.filters),
            excludeIds: parseIdList(selection.excludeIds ?? [], "excludeIds")
        };
    }

    throw invalid("selection.mode must be 'ids' or 'all'");
}

/** Validates the body of the bulk read/unread endpoint. */
function parseReadBody(body) {
    if (typeof body?.read !== "boolean") {
        throw invalid("read must be a boolean");
    }

    return { read: body.read, selection: parseSelection(body.selection) };
}

/** Validates the body of the bulk approve/dismiss endpoint. */
function parseDecisionBody(body) {
    const decisions = Object.values(REVIEW_DECISIONS);

    if (!decisions.includes(body?.decision)) {
        throw invalid(`decision must be one of: ${decisions.join(", ")}`);
    }

    return {
        decision: body.decision,
        selection: parseSelection(body.selection)
    };
}

/** Validates a single email id from the URL. */
function parseEmailId(id) {
    if (!OBJECT_ID_PATTERN.test(id)) {
        throw invalid("Invalid email id");
    }

    return id;
}

module.exports = {
    parseListQuery,
    parseReadBody,
    parseDecisionBody,
    parseEmailId
};
