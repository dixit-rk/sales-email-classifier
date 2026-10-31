import { Check, Sparkles } from "lucide-react";
import { BrandMark } from "../../../shared/ui";
import { ChemScene } from "./ChemScene";

const EXTRACTED = [
  ["PRODUCT", "Acetic Acid", ""],
  ["QUANTITY", "500 kg", ""],
  ["INTENT", "Pricing inquiry", "intent-positive"],
];

/** Left login panel: brand, headline and an illustrative extraction example. */
export function LoginHero() {
  return (
    <section className="login-art">
      <ChemScene />
      <div className="brand hero-brand">
        <span className="brand-icon"><BrandMark /></span>
        <span className="brand-wordmark">ChemQuote <em>AI</em></span>
      </div>
      <div className="hero-content">
        <div className="hero-kicker"><span className="kicker-dot" /> THE INTELLIGENT SALES INBOX</div>
        <h1>Every inquiry.<br /><span className="hero-gradient">Every opportunity.</span></h1>
        <p>Know which emails matter, which chemicals customers need, and where your next quote is waiting.</p>
        <div className="hero-demo" aria-hidden="true">
          <div className="demo-top"><span className="live-dot" /><span>INQUIRY DETECTED</span><span className="demo-time">EXAMPLE</span></div>
          <div className="demo-message">
            <div className="demo-avatar"><Check size={20} /></div>
            <div className="demo-copy"><strong>New pricing request</strong><span>Apex Chemicals · Request for quotation</span></div>
            <span className="demo-success"><Check size={16} /></span>
          </div>
          <div className="demo-divider" />
          <div className="demo-extraction">
            <span className="extract-label"><Sparkles size={15} /> AI EXTRACTED</span>
            <div className="extract-grid">
              {EXTRACTED.map(([label, value, tone]) => (
                <div key={label}><small>{label}</small><strong className={tone}>{value}</strong></div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-caption">From busy inbox to clear sales opportunities.</div>
      </div>
      <div className="hero-foot">Built for chemical sales teams <span>·</span> Powered by intelligent classification</div>
    </section>
  );
}
