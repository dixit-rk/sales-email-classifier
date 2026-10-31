const User = require("../models/User");
const { getGmailClient } = require("./gmailService");
const { fetchAndSaveEmail } = require("./emailService");

async function processGmailHistory(userId) {
    const user = await User.findById(userId);

    if (!user?.gmailHistoryId) {
        throw new Error("Gmail history cursor missing");
    }

    const gmail = getGmailClient(user);

    let pageToken;
    let latestHistoryId = user.gmailHistoryId;
    const messageIds = new Set();

    do {
        let data;

        try {
            ({ data } = await gmail.users.history.list({
                userId: "me",
                startHistoryId: user.gmailHistoryId,
                historyTypes: ["messageAdded"],
                pageToken,
                maxResults: 100
            }));
        } catch (error) {
            if (error.code !== 404 && error.response?.status !== 404) throw error;

            // Gmail keeps history for about a week; an older cursor cannot be resumed
            const { data: profile } = await gmail.users.getProfile({ userId: "me" });

            user.gmailHistoryId = profile.historyId;
            await user.save();

            return { processed: 0, historyId: profile.historyId, cursorReset: true };
        }

        for (const history of data.history || []) {
            for (const item of history.messagesAdded || []) {
                const message = item.message;

                if (message?.labelIds?.includes("INBOX")) {
                    messageIds.add(message.id);
                }
            }
        }

        if (data.historyId) {
            latestHistoryId = data.historyId;
        }

        pageToken = data.nextPageToken;
    } while (pageToken);

    for (const messageId of messageIds) {
        try {
            await fetchAndSaveEmail(user, messageId);
        } catch (error) {
            if (error.code === 404 || error.response?.status === 404) {
                // Message may have been deleted before processing.
                continue;
            }

            throw error;
        }
    }

    user.gmailHistoryId = latestHistoryId;
    await user.save();

    return {
        processed: messageIds.size,
        historyId: latestHistoryId
    };
}

module.exports = { processGmailHistory };