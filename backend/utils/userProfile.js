const { HttpError } = require("./httpError");

const BAD_REQUEST = 400;
const MAX_DISPLAY_NAME_LENGTH = 60;
const PROFILE_FIELDS = "name displayName email picture gmailConnected";

/** Maps a User document to what the browser may see; `name` is the display name, falling back to the Google name. */
function toProfile(user) {
    return {
        name: user.displayName || user.name,
        googleName: user.name,
        email: user.email,
        picture: user.picture,
        gmailConnected: user.gmailConnected
    };
}

/** Validates a display name; an empty string clears it so the Google name is used again. */
function parseDisplayName(value) {
    if (typeof value !== "string") {
        throw new HttpError(BAD_REQUEST, "displayName must be a string");
    }

    const name = value.trim().replace(/\s+/g, " ");

    if (name.length > MAX_DISPLAY_NAME_LENGTH) {
        throw new HttpError(
            BAD_REQUEST,
            `displayName must be at most ${MAX_DISPLAY_NAME_LENGTH} characters`
        );
    }

    return name;
}

module.exports = { toProfile, parseDisplayName, PROFILE_FIELDS };
