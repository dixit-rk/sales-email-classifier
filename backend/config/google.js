const { google } = require("googleapis");

const createOAuthClient = () =>
    new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

module.exports = createOAuthClient;