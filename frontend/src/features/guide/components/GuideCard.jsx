import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PreviewFrame } from "./PreviewFrame";

/** One page of the app: an animated preview on top, then what it shows and how it helps. */
export function GuideCard({ card }) {
  const { title, headline, what, helps, to, icon: Icon, Preview } = card;

  return (
    <article className="panel guide-card">
      <PreviewFrame title={title}><Preview /></PreviewFrame>
      <div className="guide-body">
        <div className="guide-title">
          <span className="stat-icon"><Icon aria-hidden="true" /></span>
          <div><h2>{title}</h2><p className="guide-headline">{headline}</p></div>
        </div>
        <h3 className="guide-label">What you’ll find here</h3>
        <p>{what}</p>
        <h3 className="guide-label">How it helps you</h3>
        <p>{helps}</p>
        <Link to={to} className="guide-link">Open {title} <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
