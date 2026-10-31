
const Email = require("../models/Email");
const { getGmailClient } = require("./gmailService");
const { classifySavedEmail } = require("./classificationService");
const { labelPricingThread } = require("./gmailLabelService");
const { emitToUser, EMAIL_CLASSIFIED_EVENT } = require("./realtimeService");
const { toEmailItem } = require("../utils/emailPresenter");

function decodeBase64Url(data) {
    if (!data) return "";
    return Buffer.from(data, "base64url").toString("utf8");
}

function extractBody(payload) {
    if (!payload) return "";

    if (payload.mimeType === "text/plain" && payload.body?.data) {
        return decodeBase64Url(payload.body.data);
    }

    for (const part of payload.parts || []) {
        const body = extractBody(part);
        if (body) return body;
    }

    return "";
}

async function fetchAndSaveEmail(user, messageId) {
    const gmail = getGmailClient(user);

    const { data: message } = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full"
    });

    const headers = message.payload?.headers || [];

    const getHeader = (name) =>
        headers.find(
            (h) => h.name.toLowerCase() === name.toLowerCase()
        )?.value || "";

    // Step 1: Save email to MongoDB
    const email = await Email.findOneAndUpdate(
        {
            userId: user._id,
            gmailMessageId: message.id
        },
        {
            $setOnInsert: {
                userId: user._id,
                gmailMessageId: message.id,
                threadId: message.threadId,
                from: getHeader("From"),
                subject: getHeader("Subject"),
                body: extractBody(message.payload),
                receivedAt: new Date(Number(message.internalDate))
            }
        },
        {
            upsert: true,
            returnDocument: "after"
        }
    );

    // Step 2: Classify and label the email
    if (["pending", "failed"].includes(email.classificationStatus)) {
        try {
            const classifiedEmail = await classifySavedEmail(email._id);

            if (classifiedEmail) {
                if (classifiedEmail.isPricingQuery || classifiedEmail.needsReview) {
                    emitToUser(
                        user._id,
                        EMAIL_CLASSIFIED_EVENT,
                        toEmailItem(classifiedEmail.toObject())
                    );
                }

                // Step 3: Apply Gmail label if the email qualifies
                try {
                    await labelPricingThread(user, classifiedEmail);
                } catch (labelError) {
                    console.error(
                        `Gmail labeling failed for ${message.id}:`,
                        labelError.message
                    );
                }
            }
        } catch (error) {
            // Email remains saved even if Gemini fails
            console.error(
                `Gemini classification failed for ${message.id}:`,
                error.message
            );
        }
    }

    return email;
}

module.exports = { fetchAndSaveEmail };
