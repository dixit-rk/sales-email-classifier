import { Mail, Reply, Sparkles } from "lucide-react";
import { HOW_IT_WORKS } from "../guideContent";

const ICONS = [Mail, Sparkles, Reply];

/** Three plain steps that explain what ChemQuote does. */
export function HowItWorks() {
  return (
    <ol className="how-steps" aria-label="How ChemQuote AI works">
      {HOW_IT_WORKS.map((step, index) => {
        const Icon = ICONS[index];

        return (
          <li key={step.title} className="how-step">
            <span className="how-number">{index + 1}</span>
            <span className="stat-icon"><Icon aria-hidden="true" /></span>
            <div><b>{step.title}</b><p>{step.text}</p></div>
          </li>
        );
      })}
    </ol>
  );
}
