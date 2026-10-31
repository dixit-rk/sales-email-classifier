const multer = require("multer");
const { CATALOG_LIMITS, XLSX_EXTENSION } = require("../constants/catalog");
const { HttpError } = require("../utils/httpError");
const { invalid } = require("../utils/queryParams");
const { parseProduct, parseCatalogQuery } = require("../utils/catalogInput");
const { OBJECT_ID_PATTERN } = require("../constants/email");
const catalogService = require("../services/catalogService");
const { importCatalog } = require("../services/catalogImportService");
const { buildTemplate } = require("../services/catalogTemplateService");

const CREATED = 201;
const NO_CONTENT = 204;
const PAYLOAD_TOO_LARGE = 413;
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const TEMPLATE_FILENAME = "chemquote-catalog-template.xlsx";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: CATALOG_LIMITS.UPLOAD_MAX_BYTES, files: 1 },
    fileFilter: (req, file, callback) => {
        const allowed = file.originalname.toLowerCase().endsWith(XLSX_EXTENSION);

        callback(allowed ? null : invalid("Upload an Excel file (.xlsx)"), allowed);
    }
});

/** Middleware that receives one .xlsx in the `file` field and turns upload errors into API errors. */
exports.receiveFile = (req, res, next) => {
    upload.single("file")(req, res, (error) => {
        if (error?.code === "LIMIT_FILE_SIZE") {
            return next(new HttpError(PAYLOAD_TOO_LARGE, "The file is larger than 1 MB"));
        }

        next(error ?? (req.file ? null : invalid("Choose an Excel file to upload")));
    });
};

exports.list = async (req, res) => {
    res.json(await catalogService.listProducts(req.session.userId, parseCatalogQuery(req.query)));
};

exports.create = async (req, res) => {
    const product = await catalogService.createProduct(req.session.userId, parseProduct(req.body));

    res.status(CREATED).json({ data: product });
};

exports.remove = async (req, res) => {
    if (!OBJECT_ID_PATTERN.test(req.params.id)) throw invalid("Invalid product id");

    await catalogService.deleteProduct(req.session.userId, req.params.id);

    res.sendStatus(NO_CONTENT);
};

exports.importFile = async (req, res) => {
    res.json({ data: await importCatalog(req.session.userId, req.file.buffer) });
};

exports.template = async (req, res) => {
    res.set({
        "Content-Type": XLSX_MIME,
        "Content-Disposition": `attachment; filename="${TEMPLATE_FILENAME}"`
    });
    res.send(Buffer.from(await buildTemplate()));
};
