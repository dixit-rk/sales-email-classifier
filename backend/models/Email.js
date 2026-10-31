
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        gmailMessageId: {
            type: String,
            required: true,
        },

        threadId: String,
        from: String,
        subject: String,
        body: String,
        receivedAt: Date,

        // Gemini classification status
        classificationStatus: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
        },

        // Pricing intent
        isPricingQuery: {
            type: Boolean,
            default: null,
        },

        // Extracted chemical products
        products: [
            {
                mentioned_name: {
                    type: String,
                    required: true,
                },
                normalized_name: {
                    type: String,
                    required: true,
                },
                in_catalog: {
                    type: Boolean,
                    required: true,
                },
            },
        ],

        // Manual review
        needsReview: {
            type: Boolean,
            default: null,
        },

        // Gemini explanation
        classificationReason: {
            type: String,
            default: "",
        },

        // Quantity mentioned by the customer, empty when none
        quantity: {
            type: String,
            default: "",
        },

        // Read state in the app
        isRead: {
            type: Boolean,
            default: false,
        },

        // Human decision on an email that needed review
        reviewDecision: {
            type: String,
            enum: ["approved", "dismissed", null],
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },

        // Classification timestamp
        classifiedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Prevent duplicate Gmail messages per user
emailSchema.index(
    { userId: 1, gmailMessageId: 1 },
    { unique: true }
);

// Serves the sorted, paginated list queries
emailSchema.index({ userId: 1, receivedAt: -1 });

module.exports = mongoose.model("Email", emailSchema);
