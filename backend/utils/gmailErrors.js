const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

/** True when Google refused the credentials: refresh token expired or revoked, or the permission is missing. */
function isGmailAuthError(error) {
    const status = error.response?.status ?? error.code;
    const reason = error.response?.data?.error;

    return (
        reason === "invalid_grant" ||
        reason === "invalid_client" ||
        /invalid_grant/.test(error.message ?? "") ||
        status === UNAUTHORIZED ||
        status === FORBIDDEN ||
        error.message === "Gmail refresh token missing"
    );
}

module.exports = { isGmailAuthError };
