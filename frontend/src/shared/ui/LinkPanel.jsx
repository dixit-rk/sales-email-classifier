import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/** Dashboard panel that takes you to `to` when clicked anywhere (`className` can add styling); the title is also a real link for keyboard and screen readers. */
export function LinkPanel({ to, title, meta, className = "", children }) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (!event.target.closest("a")) navigate(to);
  };

  return (
    <section className={`panel link-panel ${className}`} onClick={handleClick}>
      <div className="panel-head">
        <h3><Link to={to}>{title}</Link></h3>
        <span className="link-panel-meta">
          {meta && <span className="sub" style={{ fontSize: 11 }}>{meta}</span>}
          <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </div>
      {children}
    </section>
  );
}
