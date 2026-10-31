const { google } = require("googleapis");
const createOAuthClient = require("../config/google");
const { decrypt } = require("../utils/encryption");

function getGmailClient(user) {
    if (!user.encryptedRefreshToken) {
        throw new Error("Gmail refresh token missing");
    }

    const auth = createOAuthClient();

    auth.setCredentials({
        refresh_token: decrypt(user.encryptedRefreshToken)
    });

    return google.gmail({ version: "v1", auth });
}

async function startGmailWatch(user) {
    const gmail = getGmailClient(user);

    const { data } = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: process.env.GMAIL_PUBSUB_TOPIC,
            labelIds: ["INBOX"],
            labelFilterBehavior: "INCLUDE"
        }
    });

    // A renewal keeps the existing cursor so emails that arrived in between are still fetched
    user.gmailHistoryId = user.gmailHistoryId || data.historyId;
    user.gmailWatchExpiration = new Date(
        Number(data.expiration)
    );

    await user.save();

    return data;
}

module.exports = {
    getGmailClient,
    startGmailWatch
};