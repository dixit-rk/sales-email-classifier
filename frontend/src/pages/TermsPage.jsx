import { LegalDocument, TERMS_SECTIONS } from "../features/legal";
import { ROUTES } from "../shared/routes";

/** Public terms of service. */
export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      intro="These terms apply to your use of ChemQuote AI. Please read them together with the Privacy Policy."
      sections={TERMS_SECTIONS}
      otherLink={{ to: ROUTES.privacy, label: "Privacy Policy" }}
    />
  );
}
