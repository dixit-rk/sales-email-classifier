/** Field-level problems for the playground form; an empty object means it can be sent. */
export function validatePlayground(products, email) {
  const problems = { products: {} };
  const filled = products.filter((product) => product.name.trim() || product.itemCode.trim() || product.aliases.trim());

  for (const product of filled) {
    if (!product.name.trim()) problems.products[product.id] = "Enter the product name";
  }

  if (filled.length === 0) problems.list = "Add at least one product";
  if (!email.body.trim()) problems.email = "Paste or write the customer's email";

  const hasProblems = problems.list || problems.email || Object.keys(problems.products).length > 0;

  return hasProblems ? problems : {};
}

/** The request body: rows that have a name, with their text fields as typed. */
export const toPayload = (products, email) => ({
  products: products
    .filter((product) => product.name.trim())
    .map(({ name, itemCode, aliases }) => ({ name, itemCode, aliases })),
  email: { subject: email.subject, body: email.body },
});

/** What would happen to this email in the real app, in plain words. */
export function outcomeOf(result) {
  if (result.wouldLabel) return { tone: "good", text: "In the real app this email gets the “pricing query” label in Gmail and appears in the Pricing inbox." };
  if (result.needsReview) return { tone: "warn", text: "In the real app this email waits in Needs review for a quick human check." };
  if (!result.isPricingQuery) return { tone: "muted", text: "In the real app this email is ignored, because it is not asking for a price." };

  return { tone: "muted", text: "In the real app this price request is saved without the label, because none of your products were mentioned." };
}
