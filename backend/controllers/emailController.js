const {
    parseListQuery,
    parseReadBody,
    parseDecisionBody,
    parseEmailId
} = require("../utils/emailQuery");
const emailQueryService = require("../services/emailQueryService");

exports.list = async (req, res) => {
    const query = parseListQuery(req.query);

    res.json(await emailQueryService.listEmails(req.session.userId, query));
};

exports.get = async (req, res) => {
    const emailId = parseEmailId(req.params.id);

    res.json({ data: await emailQueryService.getEmail(req.session.userId, emailId) });
};

exports.counts = async (req, res) => {
    res.json({ data: await emailQueryService.countEmails(req.session.userId) });
};

exports.bulkRead = async (req, res) => {
    const body = parseReadBody(req.body);

    res.json({ data: await emailQueryService.setReadState(req.session.userId, body) });
};

exports.bulkReview = async (req, res) => {
    const body = parseDecisionBody(req.body);

    res.json({ data: await emailQueryService.decideReview(req.session.userId, body) });
};
