const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Session cookie settings. Development runs on plain HTTP; production (NODE_ENV=production) uses secure,
 * cross-site cookies because the frontend and the API are normally on different domains.
 */
const sessionCookieOptions = () => {
    const production = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: production,
        sameSite: production ? "none" : "lax",
        maxAge: DAY_MS
    };
};

module.exports = { sessionCookieOptions };
