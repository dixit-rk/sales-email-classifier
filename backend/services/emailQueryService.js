const mongoose = require("mongoose");
const Email = require("../models/Email");
const {
    VIEWS,
    SORT_FIELDS,
    SORT_ORDERS,
    REVIEW_DECISIONS,
    SELECTION_MODES,
    SNIPPET_LENGTH
} = require("../constants/email");
const { HttpError } = require("../utils/httpError");
const { toEmailItem } = require("../utils/emailPresenter");

const NOT_FOUND = 404;
const SORT_COLLATION = { locale: "en" };

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const VIEW_CONDITIONS = {
    [VIEWS.INBOX]: {
        isPricingQuery: true,
        $or: [
            { needsReview: { $ne: true } },
            { reviewDecision: REVIEW_DECISIONS.APPROVED }
        ]
    },
    [VIEWS.REVIEW]: { needsReview: true, reviewDecision: null }
};

const HAS_PRODUCT_CONDITION = { "products.0": { $exists: true } };

const READ_CONDITIONS = {
    unread: { isRead: { $ne: true } },
    read: { isRead: true }
};

const searchCondition = (search) => {
    const pattern = { $regex: escapeRegex(search), $options: "i" };

    return {
        $or: [
            { from: pattern },
            { subject: pattern },
            { "products.normalized_name": pattern },
            { "products.mentioned_name": pattern }
        ]
    };
};

/** Builds the Mongo filter for a view plus read and search filters, scoped to the user. */
function buildFilter(userId, { view, read, search }) {
    const conditions = [
        { userId: toObjectId(userId), classificationStatus: "completed" },
        VIEW_CONDITIONS[view]
    ];

    if (READ_CONDITIONS[read]) conditions.push(READ_CONDITIONS[read]);
    if (search) conditions.push(searchCondition(search));

    return { $and: conditions };
}

/** Returns one page of emails with the total, filtered and sorted in the database. */
async function listEmails(userId, { filters, sortField, sortOrder, page, limit }) {
    const match = buildFilter(userId, filters);
    const sort = {
        [SORT_FIELDS[sortField]]: SORT_ORDERS[sortOrder],
        _id: SORT_ORDERS[sortOrder]
    };

    const [rows, total] = await Promise.all([
        Email.aggregate([
            { $match: match },
            { $sort: sort },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $addFields: {
                    snippet: { $substrCP: [{ $ifNull: ["$body", ""] }, 0, SNIPPET_LENGTH] }
                }
            },
            { $project: { body: 0 } }
        ]).collation(SORT_COLLATION),
        Email.countDocuments(match)
    ]);

    return {
        data: rows.map(toEmailItem),
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
}

/** Returns one email including its full body. */
async function getEmail(userId, emailId) {
    const email = await Email.findOne({ _id: emailId, userId }).lean();

    if (!email) throw new HttpError(NOT_FOUND, "Email not found");

    return { ...toEmailItem(email), body: email.body || "" };
}

/** Returns the sidebar counters for the signed-in user. */
async function countEmails(userId) {
    const count = (filters) => Email.countDocuments(buildFilter(userId, filters));

    const [inbox, unreadInbox, review] = await Promise.all([
        count({ view: VIEWS.INBOX, read: "all", search: "" }),
        count({ view: VIEWS.INBOX, read: "unread", search: "" }),
        count({ view: VIEWS.REVIEW, read: "all", search: "" })
    ]);

    return { inbox, unreadInbox, review };
}

function buildSelectionFilter(userId, selection) {
    if (selection.mode === SELECTION_MODES.IDS) {
        return {
            userId: toObjectId(userId),
            _id: { $in: selection.ids.map(toObjectId) }
        };
    }

    const filter = buildFilter(userId, selection.filters);

    if (selection.excludeIds.length) {
        filter.$and.push({ _id: { $nin: selection.excludeIds.map(toObjectId) } });
    }

    return filter;
}

/** Marks the selected emails read or unread; select-all uses the filters, not the visible page. */
async function setReadState(userId, { read, selection }) {
    const result = await Email.updateMany(buildSelectionFilter(userId, selection), {
        $set: { isRead: read }
    });

    return { matched: result.matchedCount, modified: result.modifiedCount };
}

/** Approves or dismisses selected emails still in the review queue; approval needs an identified product. */
async function decideReview(userId, { decision, selection }) {
    const filter = {
        $and: [
            buildSelectionFilter(userId, selection),
            VIEW_CONDITIONS[VIEWS.REVIEW]
        ]
    };

    if (decision === REVIEW_DECISIONS.APPROVED) {
        filter.$and.push(HAS_PRODUCT_CONDITION);
    }

    const result = await Email.updateMany(filter, {
        $set: { reviewDecision: decision, reviewedAt: new Date() }
    });

    return { matched: result.matchedCount, modified: result.modifiedCount };
}

module.exports = {
    buildFilter,
    listEmails,
    getEmail,
    countEmails,
    setReadState,
    decideReview
};
