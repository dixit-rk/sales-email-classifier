import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/routes";
import { BrandMark } from "../../shared/ui";
import { APP_NAME, LAST_UPDATED } from "./legalContent";
import "./legal.css";

/** A public legal page: brand header, a title with the last-updated date, and numbered sections. */
export function LegalDocument({ title, intro, sections, otherLink }) {
  return (
    <div className="legal-page">
      <header className="legal-top">
        <Link to={ROUTES.login} className="brand" aria-label={`${APP_NAME} home`}>
          <span className="brand-icon"><BrandMark /></span>
          <span className="brand-wordmark">ChemQuote <em>AI</em></span>
        </Link>
        <Link to={ROUTES.login} className="btn">Back to sign in</Link>
      </header>
      <main className="legal-main">
        <div className="eyebrow">LEGAL</div>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated {LAST_UPDATED}</p>
        <p className="legal-intro">{intro}</p>
        {sections.map((section, index) => (
          <section key={section.title} className="legal-section">
            <h2>{index + 1}. {section.title}</h2>
            {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
            {section.list && <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
        ))}
        <footer className="legal-foot">
          <Link to={otherLink.to}>{otherLink.label}</Link>
          <Link to={ROUTES.playground}>AI playground</Link>
        </footer>
      </main>
    </div>
  );
}
