const User = require("../models/User");
const { HttpError } = require("../utils/httpError");
const { parseLabelName } = require("../utils/labelInput");
const { getLabelName } = require("../services/gmailLabelService");
const settingsService = require("../services/gmailSettingsService");

const UNAUTHORIZED = 401;

async function currentUser(req) {
    const user = await User.findById(req.session.userId);

    if (!user) throw new HttpError(UNAUTHORIZED, "User not found");

    return user;
}

exports.connection = async (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ data: await settingsService.checkConnection(await currentUser(req)) });
};

exports.getLabel = async (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ data: { name: getLabelName(await currentUser(req)) } });
};

exports.replaceLabel = async (req, res) => {
    const name = parseLabelName(req.body?.name);

    res.json({ data: await settingsService.replaceLabel(await currentUser(req), name) });
};
