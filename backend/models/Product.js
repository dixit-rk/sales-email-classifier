const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: { type: String, required: true },
        normalizedName: { type: String, required: true },
        // The company's own code for the product, which customers often use instead of the name
        itemCode: { type: String, default: "" },
        formula: { type: String, default: "" },

        // Other names customers use for this product
        aliases: { type: [String], default: [] },

        // Normalized name, item code, aliases and formula: what incoming emails are matched against
        normalizedTerms: { type: [String], default: [] }
    },
    { timestamps: true }
);

productSchema.index({ userId: 1, normalizedName: 1 }, { unique: true });
productSchema.index({ userId: 1, normalizedTerms: 1 });

module.exports = mongoose.model("Product", productSchema);
