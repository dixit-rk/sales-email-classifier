
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { processGmailHistory } = require("../services/historyService");

const router = express.Router();
const verifier = new OAuth2Client();

router.post("/gmail", async (req, res) => {
    // Step 1: Verify Pub/Sub authentication
    try {
        const header = req.headers.authorization || "";

        if (!header.startsWith("Bearer ")) {
            return res.status(401).send("Missing authentication");
        }

        const ticket = await verifier.verifyIdToken({
            idToken: header.slice(7),
            audience: process.env.PUBSUB_AUDIENCE
        });

        const payload = ticket.getPayload();

        if (
            payload.email !== process.env.PUBSUB_SERVICE_ACCOUNT_EMAIL ||
            payload.email_verified !== true
        ) {
            return res.status(403).send("Unauthorized publisher");
        }
    } catch (error) {
        console.error("Webhook authentication failed:", error.message);
        return res.status(401).send("Invalid authentication");
    }

    // Step 2: Validate and decode notification
    let notification;

    try {
        if (!req.body?.message?.data) {
            return res.status(400).send("Invalid Pub/Sub message");
        }

        notification = JSON.parse(
            Buffer.from(req.body.message.data, "base64").toString("utf8")
        );

        if (!notification.emailAddress || !notification.historyId) {
            return res.status(400).send("Invalid Gmail notification");
        }
    } catch (error) {
        console.error("Invalid notification payload:", error.message);
        return res.status(400).send("Invalid notification");
    }

    // Step 3: Find user and process Gmail history
    try {
        const user = await User.findOne({
            email: {
                $regex: `^${notification.emailAddress.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i"
            }
        });

        if (!user) {
            console.warn("Notification for unknown Gmail account");
            return res.sendStatus(204);
        }

        if (!user.gmailConnected) {
            console.warn("Gmail is not connected for this user");
            return res.sendStatus(204);
        }

        const result = await processGmailHistory(user._id);

        console.log("Gmail history processed:", result);

        // Acknowledge only after processing succeeds
        return res.sendStatus(204);

    } catch (error) {
        console.error("Gmail processing failed:", error.message);

        // Pub/Sub will retry on server errors
        return res.status(503).send("Gmail processing failed");
    }
});

module.exports = router;
