const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        displayName: {
            type: String,
            maxlength: 60,
            default: ""
        },
        email: {
            type: String,
            required: true
        },
        picture: String,
        encryptedRefreshToken: String,
        gmailConnected: {
            type: Boolean,
            default: false
        },
        // Gmail label put on pricing threads; unset means the default
        labelName: String,
        gmailHistoryId: String,
        gmailWatchExpiration: Date,
    },
    { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);