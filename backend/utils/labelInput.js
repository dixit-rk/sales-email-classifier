const { LABEL_LIMITS, RESERVED_LABEL_NAMES } = require("../constants/gmail");
const { invalid } = require("./queryParams");

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

/** Validates a Gmail label name typed in Settings: trimmed, not empty, not too long and not a reserved Gmail name. */
function parseLabelName(value) {
    const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

    if (!name) throw invalid("Enter a label name");

    if (name.length > LABEL_LIMITS.MAX_NAME_LENGTH) {
        throw invalid(`A label name can be at most ${LABEL_LIMITS.MAX_NAME_LENGTH} characters`);
    }

    if (CONTROL_CHARACTERS.test(name)) throw invalid("A label name cannot contain control characters");

    const lower = name.toLowerCase();

    if (RESERVED_LABEL_NAMES.includes(lower) || lower.startsWith("category_")) {
        throw invalid(`"${name}" is reserved by Gmail. Choose another name`);
    }

    return name;
}

module.exports = { parseLabelName };
