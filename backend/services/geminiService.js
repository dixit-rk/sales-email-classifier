
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL;
const GEMINI_TIMEOUT_MS = 25000;

const buildSystemPrompt = (catalogBlock) => `
You are an expert email classifier for a chemical manufacturing company.

${catalogBlock}

Your responsibilities:
1. Detect whether the customer requests pricing, a quotation,
   commercial rates, or a price estimate, explicitly or implicitly.
2. Extract all chemical products mentioned in the email.
3. Preserve the exact mentioned product name.
4. Normalize obvious misspellings, synonyms, and abbreviations.
5. When the customer's wording is a catalog product's name or one of its
   "also called" names, use that catalog product's name as normalized_name.

Rules:
- Pricing intent is independent of catalog membership.
- Delivery updates, invoices, payment reminders, safety data sheet
  requests, and existing order updates are not pricing inquiries
  unless they also request new pricing.
- Never invent chemical products.
- Do not extract unrelated products such as electronics.
- Never force a catalog match.
- If the chemical identity or pricing intent is ambiguous,
  set needs_review to true.
- An unavailable product alone does not require review.
- Put the requested quantity with its unit (for example "500 kg") in
  quantity, or an empty string when none is stated.
- Use an empty products array if no chemicals are mentioned.
- Return only the requested structured JSON.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        is_pricing_query: {
            type: Type.BOOLEAN,
        },
        products: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    mentioned_name: { type: Type.STRING },
                    normalized_name: { type: Type.STRING },
                    in_catalog: { type: Type.BOOLEAN },
                },
                required: [
                    "mentioned_name",
                    "normalized_name",
                    "in_catalog",
                ],
            },
        },
        needs_review: {
            type: Type.BOOLEAN,
        },
        quantity: {
            type: Type.STRING,
        },
        reason: {
            type: Type.STRING,
        },
    },
    required: [
        "is_pricing_query",
        "products",
        "needs_review",
        "quantity",
        "reason",
    ],
};

/** Classifies one email; `catalogBlock` is the catalog section of the prompt (see catalogService.buildCatalogPrompt). */
async function classifyEmail(email, catalogBlock) {
    if (!email?.subject && !email?.body) {
        throw new Error("Email subject or body is required");
    }

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: JSON.stringify({
            subject: email.subject || "",
            body: email.body || "",
        }),
        config: {
            systemInstruction: buildSystemPrompt(catalogBlock),
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0,
            httpOptions: { timeout: GEMINI_TIMEOUT_MS },
        },
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty response");
    }

    const result = JSON.parse(response.text);

    if (
        typeof result.is_pricing_query !== "boolean" ||
        !Array.isArray(result.products) ||
        typeof result.needs_review !== "boolean" ||
        typeof result.quantity !== "string" ||
        typeof result.reason !== "string" ||
        result.products.some(
            (product) =>
                typeof product.mentioned_name !== "string" ||
                typeof product.normalized_name !== "string" ||
                typeof product.in_catalog !== "boolean"
        )
    ) {
        throw new Error("Gemini returned an invalid classification");
    }

    return result;
}

module.exports = { classifyEmail };
