const mongoose = require("mongoose");

// One counter per anonymous visitor identity. `key` is a keyed hash, never the raw device id or IP address.
const playgroundUsageSchema = new mongoose.Schema(
    {
        scope: { type: String, enum: ["device", "network", "day"], required: true },
        key: { type: String, required: true },
        count: { type: Number, default: 0, min: 0 },
        firstUsedAt: Date,
        lastUsedAt: Date
    },
    { timestamps: true }
);

playgroundUsageSchema.index({ scope: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("PlaygroundUsage", playgroundUsageSchema);
