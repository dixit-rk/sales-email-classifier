/** Error carrying the HTTP status the global handler should answer with. */
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

module.exports = { HttpError };
