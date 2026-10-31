const CATALOG_LIMITS = {
    MAX_PRODUCTS: 2000,
    MAX_NAME_LENGTH: 80,
    MAX_FORMULA_LENGTH: 40,
    MAX_ITEM_CODE_LENGTH: 40,
    MAX_ALIASES: 25,
    MAX_ALIAS_LENGTH: 80,
    MAX_SEARCH_LENGTH: 100,
    MAX_IMPORT_ROWS: 500,
    UPLOAD_MAX_BYTES: 1024 * 1024
};

const CATALOG_SORT_FIELDS = { name: "normalizedName", createdAt: "createdAt" };

// Up to this many products the whole catalog goes into the AI prompt; beyond it only the closest candidates do.
const PROMPT_CATALOG_LIMIT = 100;
const PROMPT_CANDIDATE_LIMIT = 40;
const MAX_NGRAM_WORDS = 4;
const MAX_NGRAMS = 2000;
const NGRAM_SOURCE_LENGTH = 3000;

const IMPORT_SHEET_NAME = "Products";
const XLSX_MAGIC = "PK";
const XLSX_EXTENSION = ".xlsx";

module.exports = {
    CATALOG_LIMITS,
    CATALOG_SORT_FIELDS,
    PROMPT_CATALOG_LIMIT,
    PROMPT_CANDIDATE_LIMIT,
    MAX_NGRAM_WORDS,
    MAX_NGRAMS,
    NGRAM_SOURCE_LENGTH,
    IMPORT_SHEET_NAME,
    XLSX_MAGIC,
    XLSX_EXTENSION
};
