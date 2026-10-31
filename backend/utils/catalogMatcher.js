/** Lower-cases, strips accents and punctuation and collapses spaces, so "Acetic-Acid" and "acetic  acid" compare equal. */
function normalizeTerm(text) {
    return String(text ?? "")
        .normalize("NFKD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

/** The normalized form with the spaces removed. */
const compact = (term) => term.replaceAll(" ", "");

/**
 * Looks a customer's wording up in the catalog by exact normalized name, alias or formula.
 * `entries` are `{ id, name, terms }`. Returns `{ kind: "exact", entry }`, `{ kind: "ambiguous", entries }` or null.
 * Spelling mistakes are not guessed at here: the AI corrects them, and aliases cover the common ones.
 */
function findMatch(rawTerm, entries) {
    const term = normalizeTerm(rawTerm);

    if (!term) return null;

    // Item codes are also stored without separators, so "PCFG-228", "PCFG 228" and "PCFG228" all match
    for (const candidate of new Set([term, compact(term)])) {
        const matches = entries.filter((entry) => entry.terms.includes(candidate));

        if (matches.length === 1) return { kind: "exact", entry: matches[0] };
        if (matches.length > 1) return { kind: "ambiguous", entries: matches };
    }

    return null;
}

module.exports = { normalizeTerm, compact, findMatch };
