require("dotenv").config();

const { classifyEmail } = require("./services/geminiService");
const { formatCatalogPrompt } = require("./services/catalogService");

// A manual check of the AI step on its own: one sample email against a small sample catalog.
const catalog = formatCatalogPrompt([
    { name: "Acetic Acid", itemCode: "AA-101", formula: "CH3COOH", aliases: ["Asetic Acid", "Ethanoic Acid"] },
    { name: "Citric Acid", itemCode: "CA-103", formula: "C6H8O7", aliases: ["lemon salt"] }
]);

async function main() {
    const result = await classifyEmail(
        {
            subject: "Request for quotation",
            body: "Hello, we need 500 kg of Asetic Acid. Please share your best price."
        },
        catalog
    );

    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
