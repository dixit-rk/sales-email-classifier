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

/** True only when the saved token itself is no longer valid (revoked or expired), not for a denied request. */
function isGmailTokenError(error) {
    const status = error.response?.status ?? error.code;

    return error.response?.data?.error === "invalid_grant" || /invalid_grant/.test(error.message ?? "") || status === UNAUTHORIZED;
}

module.exports = { isGmailAuthError, isGmailTokenError };
