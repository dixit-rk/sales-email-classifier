import { LegalDocument, PRIVACY_SECTIONS } from "../features/legal";
import { ROUTES } from "../shared/routes";

/** Public privacy policy. */
export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="This policy explains what ChemQuote AI collects when you sign in with Google, how it is used, and the choices you have."
      sections={PRIVACY_SECTIONS}
      otherLink={{ to: ROUTES.terms, label: "Terms of Service" }}
    />
  );
}
