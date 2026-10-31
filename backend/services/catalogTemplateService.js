const ExcelJS = require("exceljs");
const { CATALOG_LIMITS, IMPORT_SHEET_NAME } = require("../constants/catalog");

const HEADERS = ["Product name", "Item Code", "Formula", "Aliases"];
const COLUMN_WIDTHS = [32, 18, 18, 60];
const HEADER_FILL = "FFE9EDFF";

const EXAMPLES = [
    ["Polysorbate 80", "PCFG228", "C64H124O26", "Tween 80, Polyoxyethylene sorbitan monooleate"],
    ["Sodium Hydroxide", "SH-101", "NaOH", "Caustic soda, Lye, Soda lye"]
];

const INSTRUCTIONS = [
    "How to fill the Products sheet",
    "",
    "Product name (required): the name you sell the product under. Must be unique.",
    "Item Code (optional): your own code for the product, for example PCFG228. Customers often use it instead of the name, so it is matched too. Must be unique.",
    "Formula (optional): for example NaOH. Customers often write the formula, so it is matched too.",
    `Aliases (optional): other names customers use, separated by commas, semicolons or new lines. Up to ${CATALOG_LIMITS.MAX_ALIASES} per product.`,
    "",
    `Up to ${CATALOG_LIMITS.MAX_IMPORT_ROWS} rows per upload. A product that already exists is updated: new aliases are added.`,
    "A name, alias or formula already used by a different product is reported and skipped.",
    "",
    "Examples (columns: Product name | Item Code | Formula | Aliases):"
];

/** Builds the downloadable Excel template: an empty Products sheet and an Instructions sheet with examples. */
async function buildTemplate() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(IMPORT_SHEET_NAME, { views: [{ state: "frozen", ySplit: 1 }] });

    sheet.addRow(HEADERS).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } };
    });
    COLUMN_WIDTHS.forEach((width, index) => {
        sheet.getColumn(index + 1).width = width;
    });

    const help = workbook.addWorksheet("Instructions");

    help.getColumn(1).width = 110;
    INSTRUCTIONS.forEach((line) => help.addRow([line]));
    help.getCell("A1").font = { bold: true, size: 14 };
    EXAMPLES.forEach((example) => help.addRow([example.join("  |  ")]));

    return workbook.xlsx.writeBuffer();
}

module.exports = { buildTemplate, HEADERS };
