const ExcelJS = require("exceljs");
const { CATALOG_LIMITS, IMPORT_SHEET_NAME, XLSX_MAGIC } = require("../constants/catalog");
const { HttpError } = require("../utils/httpError");
const { parseProduct } = require("../utils/catalogInput");
const { createProduct, updateProduct, findByName } = require("./catalogService");

const BAD_REQUEST = 400;
const PAYLOAD_TOO_LARGE = 413;
const HEADER_ROW = 1;

const COLUMN_NAMES = {
    name: ["product name", "name", "product"],
    itemCode: ["item code", "itemcode", "product code", "code", "sku"],
    formula: ["formula", "chemical formula"],
    aliases: ["aliases", "alias", "also known as", "other names", "also called"]
};

const cellText = (cell) => (cell?.text ?? "").toString().trim();

function findColumns(sheet) {
    const columns = {};

    sheet.getRow(HEADER_ROW).eachCell((cell, index) => {
        const header = cellText(cell).toLowerCase();

        for (const [field, names] of Object.entries(COLUMN_NAMES)) {
            if (names.includes(header) && !columns[field]) columns[field] = index;
        }
    });

    if (!columns.name) {
        throw new HttpError(BAD_REQUEST, 'The sheet needs a "Product name" column in its first row');
    }

    return columns;
}

async function loadSheet(buffer) {
    if (buffer.subarray(0, 2).toString("latin1") !== XLSX_MAGIC) {
        throw new HttpError(BAD_REQUEST, "The file is not a valid .xlsx workbook");
    }

    const workbook = new ExcelJS.Workbook();

    try {
        await workbook.xlsx.load(buffer);
    } catch {
        throw new HttpError(BAD_REQUEST, "The file could not be read as an Excel workbook");
    }

    const sheet = workbook.getWorksheet(IMPORT_SHEET_NAME) ?? workbook.worksheets[0];

    if (!sheet) throw new HttpError(BAD_REQUEST, "The workbook has no sheets");

    return sheet;
}

function readRows(sheet) {
    const columns = findColumns(sheet);
    const rows = [];

    sheet.eachRow((row, rowNumber) => {
        if (rowNumber === HEADER_ROW) return;

        const entry = {
            name: cellText(row.getCell(columns.name)),
            itemCode: columns.itemCode ? cellText(row.getCell(columns.itemCode)) : "",
            formula: columns.formula ? cellText(row.getCell(columns.formula)) : "",
            aliases: columns.aliases ? cellText(row.getCell(columns.aliases)) : ""
        };

        if (entry.name || entry.itemCode || entry.formula || entry.aliases) rows.push({ rowNumber, entry });
    });

    if (rows.length > CATALOG_LIMITS.MAX_IMPORT_ROWS) {
        throw new HttpError(
            PAYLOAD_TOO_LARGE,
            `The sheet has ${rows.length} rows; the limit is ${CATALOG_LIMITS.MAX_IMPORT_ROWS} per upload`
        );
    }

    return rows;
}

async function importRow(userId, entry) {
    const input = parseProduct(entry);
    const existing = await findByName(userId, input.name);

    if (existing) {
        await updateProduct(userId, existing, input);
        return "updated";
    }

    await createProduct(userId, input);
    return "created";
}

/**
 * Imports products from an uploaded .xlsx. Valid rows are saved, invalid ones are reported with their
 * row number; a product that already exists is updated rather than duplicated.
 */
async function importCatalog(userId, buffer) {
    const rows = readRows(await loadSheet(buffer));
    const summary = { created: 0, updated: 0, errors: [] };

    for (const { rowNumber, entry } of rows) {
        try {
            summary[await importRow(userId, entry)] += 1;
        } catch (error) {
            if (!(error instanceof HttpError)) throw error;
            summary.errors.push({ row: rowNumber, name: entry.name, message: error.message });
        }
    }

    return { ...summary, skipped: summary.errors.length };
}

module.exports = { importCatalog };
