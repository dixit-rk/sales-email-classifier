
const { getGmailClient } = require("./gmailService");

const LABEL_NAME = "pricing query";

async function fetchPricingThreads(user, pageToken) {
    const gmail = getGmailClient(user);

    // Find the existing Gmail label
    const { data: labelData } = await gmail.users.labels.list({
        userId: "me"
    });

    const label = (labelData.labels || []).find(
        (item) =>
            item.name.toLowerCase() === LABEL_NAME
    );

    if (!label) {
        return {
            threads: [],
            nextPageToken: null
        };
    }

    // Retrieve Gmail threads carrying the label
    const { data } = await gmail.users.threads.list({
        userId: "me",
        labelIds: [label.id],
        maxResults: 20,
        ...(pageToken ? { pageToken } : {})
    });

    const threadIds = data.threads || [];

    const threads = await Promise.all(
        threadIds.map(async ({ id }) => {
            const { data: thread } =
                await gmail.users.threads.get({
                    userId: "me",
                    id,
                    format: "metadata",
                    metadataHeaders: [
                        "From",
                        "Subject",
                        "Date"
                    ]
                });

            const messages = thread.messages || [];

            const latestMessage = messages.at(-1);

            if (!latestMessage) {
                return null;
            }

            const headers =
                latestMessage.payload?.headers || [];

            const getHeader = (name) =>
                headers.find(
                    (h) =>
                        h.name.toLowerCase() ===
                        name.toLowerCase()
                )?.value || "";

            const isUnread = messages.some(
                (message) =>
                    message.labelIds?.includes("UNREAD")
            );

            return {
                threadId: id,
                from: getHeader("From"),
                subject: getHeader("Subject"),
                snippet: latestMessage.snippet || "",
                receivedAt: new Date(
                    Number(latestMessage.internalDate)
                ).toISOString(),
                unread: isUnread,
                messageCount: messages.length
            };
        })
    );

    return {
        threads: threads.filter(Boolean),
        nextPageToken: data.nextPageToken || null
    };
}

module.exports = { fetchPricingThreads };
