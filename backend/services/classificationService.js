
const Email = require("../models/Email");
const { classifyEmail } = require("./geminiService");
const { buildCatalogPrompt, applyCatalog } = require("./catalogService");

async function classifySavedEmail(emailId) {
    // Claim the email to avoid duplicate classification
    const email = await Email.findOneAndUpdate(
        {
            _id: emailId,
            classificationStatus: { $in: ["pending", "failed"] },
        },
        {
            $set: {
                classificationStatus: "processing",
            },
        },
        { returnDocument: "after" }
    );

    if (!email) {
        return null;
    }

    try {
        // Ask Gemini to classify the email
        const catalogBlock = await buildCatalogPrompt(
            email.userId,
            `${email.subject}\n${email.body}`
        );
        const aiResult = await classifyEmail(
            { subject: email.subject, body: email.body },
            catalogBlock
        );

        // The catalog, not the AI, decides which products are in the catalog
        const matched = await applyCatalog(email.userId, aiResult);
        const result = {
            ...aiResult,
            products: matched.products,
            needs_review: matched.needsReview,
            reason: matched.reason,
        };

        // Save classification results
        const updatedEmail = await Email.findByIdAndUpdate(
            email._id,
            {
                $set: {
                    classificationStatus: "completed",
                    isPricingQuery: result.is_pricing_query,
                    products: result.products,
                    needsReview: result.needs_review,
                    quantity: result.quantity,
                    classificationReason: result.reason,
                    classifiedAt: new Date(),
                },
            },
            { returnDocument: "after", runValidators: true }
        );

        console.log("Email classified:", {
            id: email.gmailMessageId,
            isPricingQuery: result.is_pricing_query,
            products: result.products.map((p) => p.normalized_name),
        });

        return updatedEmail;
    } catch (error) {
        await Email.findByIdAndUpdate(email._id, {
            $set: { classificationStatus: "failed" },
        });

        console.error(
            `Classification failed for ${email.gmailMessageId}:`,
            error.message
        );

        throw error;
    }
}

module.exports = { classifySavedEmail };
