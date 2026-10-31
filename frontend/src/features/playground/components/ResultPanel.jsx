import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ROUTES } from "../../../shared/routes";
import { Tag } from "../../../shared/ui";
import { outcomeOf } from "../lib/validate";

function Row({ label, children }) {
  return <div className="pg-row"><span className="pg-row-label">{label}</span><div>{children}</div></div>;
}

function Found({ result }) {
  const outcome = outcomeOf(result);

  return (
    <div className="pg-found">
      <Row label="Price request?">
        <Tag tone={result.isPricingQuery ? "green" : "manual"}>{result.isPricingQuery ? "Yes, asking for a price" : "No"}</Tag>
      </Row>
      <Row label="Quantity"><b>{result.quantity || "Not stated"}</b></Row>
      <Row label="Products">
        {result.products.length === 0 ? <span className="pg-muted">None mentioned</span> : (
          <ul className="pg-items">
            {result.products.map((product, index) => (
              <li key={`${product.mentionedName}-${index}`}>
                <span className="pg-said">“{product.mentionedName}”</span>
                {product.inCatalog ? (
                  <><span aria-hidden="true">→</span><Tag tone="green">{product.normalizedName}</Tag><small>matched by {product.matchedVia ?? "name"}</small></>
                ) : (
                  <Tag tone="manual">Not in your list</Tag>
                )}
              </li>
            ))}
          </ul>
        )}
      </Row>
      <Row label="Needs a check?"><Tag tone={result.needsReview ? "review" : "green"}>{result.needsReview ? "Yes, a person should look" : "No"}</Tag></Row>
      <Row label="Why"><span className="pg-muted">{result.reason}</span></Row>
      <div className={`pg-outcome ${outcome.tone}`}>{outcome.text}</div>
    </div>
  );
}

/** What the AI found in the email, or a placeholder, a loading line or an error. */
export function ResultPanel({ status, result, error, exhausted }) {
  const body = () => {
    if (status === "loading") return <p className="pg-state" role="status">Reading the email…</p>;

    if (status === "error") {
      return (
        <div className="pg-state" role="alert">
          <b>{error}</b>
          {exhausted && <p><Link to={ROUTES.login} className="btn primary">Sign in with Google</Link></p>}
        </div>
      );
    }

    if (status === "done") return <Found result={result} />;

    return (
      <div className="pg-state">
        <span className="pg-state-icon"><Sparkles size={24} aria-hidden="true" /></span>
        <b>Nothing yet</b>
        <p>Press “Analyze with AI” to see what the AI finds in this email.</p>
      </div>
    );
  };

  return (
    <section className="panel pg-card" aria-labelledby="pg-result-title" aria-busy={status === "loading"}>
      <header className="pg-card-head">
        <div>
          <span className="pg-step">Step 3</span>
          <h2 id="pg-result-title">What the AI found</h2>
          <p>The same reading ChemQuote does on every new email.</p>
        </div>
      </header>
      <div className="pg-result-body">{body()}</div>
    </section>
  );
}
