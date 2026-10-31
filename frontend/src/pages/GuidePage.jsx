import { Mail } from "lucide-react";
import { GUIDE_CARDS, GuideCard, HowItWorks, SUPPORT_EMAIL } from "../features/guide";
import { PageHeader } from "../shared/ui";

/** Help and guide: a friendly tour of every page, with an animated preview of each. */
export default function GuidePage() {
  const contact = (
    <a className="btn" href={`mailto:${SUPPORT_EMAIL}`}><Mail aria-hidden="true" /> Contact support</a>
  );

  return (
    <div className="content">
      <PageHeader
        eyebrow="HELP & SUPPORT"
        title="Guide"
        subtitle="A quick tour of every page, in plain words."
        actions={contact}
      />
      <HowItWorks />
      <div className="guide-grid">
        {GUIDE_CARDS.map((card) => <GuideCard key={card.id} card={card} />)}
      </div>
      <section className="panel support-card">
        <div>
          <h2>Still have a question?</h2>
          <p>Send us an email and we’ll be happy to help.</p>
        </div>
        {contact}
      </section>
    </div>
  );
}
