
const User = require("../models/User");
const { startGmailWatch } = require("../services/gmailService");
const {
    fetchPricingThreads
} = require("../services/pricingThreadsService");

exports.startWatch = async (req, res, next) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        const user = await User.findById(req.session.userId);

        if (!user || !user.gmailConnected) {
            return res.status(400).json({
                message: "Gmail is not connected"
            });
        }

        const result = await startGmailWatch(user);

        res.json({
            success: true,
            historyId: result.historyId,
            expiration: new Date(
                Number(result.expiration)
            ).toISOString()
        });
    } catch (error) {
        next(error);
    }
};

exports.getPricingThreads = async (req, res, next) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        const user = await User.findById(req.session.userId);

        if (!user || !user.gmailConnected) {
            return res.status(400).json({
                message: "Gmail is not connected"
            });
        }

        const result = await fetchPricingThreads(
            user,
            req.query.pageToken
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
};
