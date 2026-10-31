const { HttpError } = require("./httpError");

const BAD_REQUEST = 400;

/** A 400 error for invalid client input. */
const invalid = (message) => new HttpError(BAD_REQUEST, message);

/** Parses an optional positive integer query value. */
function parsePositiveInt(value, fallback, name) {
    if (value === undefined || value === "") return fallback;

    const number = Number(value);

    if (!Number.isInteger(number) || number < 1) {
        throw invalid(`${name} must be a positive integer`);
    }

    return number;
}

/** Parses an optional value that must be one of `allowed`. */
function pickOption(value, allowed, fallback, name) {
    if (value === undefined || value === "") return fallback;

    if (!allowed.includes(value)) {
        throw invalid(`${name} must be one of: ${allowed.join(", ")}`);
    }

    return value;
}

module.exports = { invalid, parsePositiveInt, pickOption };
