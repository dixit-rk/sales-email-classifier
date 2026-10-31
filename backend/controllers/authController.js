const crypto = require("crypto");
const { google } = require("googleapis");
const createOAuthClient = require("../config/google");
const User = require("../models/User");
const { encrypt } = require("../utils/encryption");
const { ensureConfiguredLabel } = require("../services/gmailLabelService");
const { ensureWatch } = require("../services/gmailWatchService");
const {
    toProfile,
    parseDisplayName,
    PROFILE_FIELDS
} = require("../utils/userProfile");

const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.modify"
];

exports.googleLogin = (req, res, next) => {
    try {
        const state = crypto.randomBytes(32).toString("hex");
        req.session.oauthState = state;

        const oauth = createOAuthClient();

        const url = oauth.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: scopes,
            state
        });

        req.session.save((err) => {
            if (err) return next(err);
            res.redirect(url);
        });
    } catch (err) {
        next(err);
    }
};

exports.googleCallback = async (req, res, next) => {
    try {
        const { code, state, error } = req.query;

        if (error) {
            return res.status(400).send("Google authorization denied");
        }

        if (
            !code ||
            !state ||
            !req.session.oauthState ||
            state !== req.session.oauthState
        ) {
            return res.status(400).send("Invalid OAuth state");
        }

        delete req.session.oauthState;

        const oauth = createOAuthClient();
        const { tokens } = await oauth.getToken(code);

        const ticket = await oauth.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const profile = ticket.getPayload();

        if (!profile.email_verified) {
            return res.status(403).send("Google email not verified");
        }

        const tokenInfo = await oauth.getTokenInfo(
            tokens.access_token
        );

        const hasGmailPermission = tokenInfo.scopes.includes(
            "https://www.googleapis.com/auth/gmail.modify"
        );

        if (!hasGmailPermission) {
            return res.status(403).send("Gmail permission required");
        }

        let user = await User.findOne({ googleId: profile.sub });

        if (!user) {
            user = new User({ googleId: profile.sub });
        }

        user.name = profile.name;
        user.email = profile.email;
        user.picture = profile.picture;

        if (tokens.refresh_token) {
            user.encryptedRefreshToken = encrypt(tokens.refresh_token);
        }

        user.gmailConnected = Boolean(user.encryptedRefreshToken);

        if (!user.gmailConnected) {
            return res.status(400).send(
                "No refresh token received. Please reconnect Google."
            );
        }

        await user.save();

        try {
            await ensureConfiguredLabel(user);
        } catch (labelError) {
            console.error("Gmail label setup failed:", labelError.message);
        }

        try {
            await ensureWatch(user);
        } catch (watchError) {
            console.error("Gmail watch setup failed:", watchError.message);
        }

        req.session.regenerate((err) => {
            if (err) return next(err);

            req.session.userId = user._id.toString();

            req.session.save((saveErr) => {
                if (saveErr) return next(saveErr);

                res.redirect(process.env.FRONTEND_URL);
            });
        });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        const user = await User.findById(req.session.userId)
            .select(PROFILE_FIELDS);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        res.json({ user: toProfile(user) });
    } catch (err) {
        next(err);
    }
};

exports.updateMe = async (req, res) => {
    const displayName = parseDisplayName(req.body?.displayName);

    const user = await User.findByIdAndUpdate(
        req.session.userId,
        { $set: { displayName } },
        { returnDocument: "after", runValidators: true }
    ).select(PROFILE_FIELDS);

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: toProfile(user) });
};

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("connect.sid");
        res.json({ message: "Logged out" });
    });
};