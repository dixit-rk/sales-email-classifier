import { useId } from "react";

const BEAKER_OUTLINE = "M19 5h10M22 5v12L10 37a5 5 0 0 0 4.3 7h20a5 5 0 0 0 4.3-7L26 17V5";
const BEAKER_INSIDE = "M22 5v12L10 37a5 5 0 0 0 4.3 7h20a5 5 0 0 0 4.3-7L26 17V5Z";
const WAVE = "M-24 0q6-4 12 0t12 0t12 0t12 0t12 0t12 0V40H-24Z";

/**
 * The app's loading screen: a chemical beaker whose liquid rises and falls. It fills the screen by default;
 * `inline` fills only the space it is placed in (used inside the page frame so the sidebar stays visible).
 */
export function AppLoader({ inline = false }) {
  const id = useId().replaceAll(":", "");

  return (
    <div className={`app-loader ${inline ? "inline" : ""}`} role="status">
      <svg className="beaker-loader" viewBox="0 0 48 48" width="104" height="104" aria-hidden="true">
        <defs>
          <clipPath id={`${id}-inside`}><path d={BEAKER_INSIDE} /></clipPath>
          <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#14bbca" />
            <stop offset="1" stopColor="#4059e4" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${id}-inside)`}>
          <g className="beaker-liquid">
            <path className="beaker-wave" d={WAVE} fill={`url(#${id}-liquid)`} />
          </g>
          <circle className="beaker-bubble b1" cx="22" cy="40" r="1.8" />
          <circle className="beaker-bubble b2" cx="28" cy="40" r="1.3" />
          <circle className="beaker-bubble b3" cx="25" cy="40" r="2.1" />
        </g>
        <path d={BEAKER_OUTLINE} className="beaker-outline" fill="none" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">Loading ChemQuote AI</span>
    </div>
  );
}
