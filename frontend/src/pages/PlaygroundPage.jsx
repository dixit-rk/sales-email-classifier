import { ArrowRight, Moon, RotateCcw, Sparkles, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth";
import { AccessNote, EmailEditor, ProductsEditor, QuotaPill, ResultPanel, usePlayground } from "../features/playground";
import { ROUTES } from "../shared/routes";
import { useTheme } from "../shared/theme/themeContext";
import { BrandMark, Button, IconButton } from "../shared/ui";

/** Public playground: try the AI on a made-up email and product list without signing in. */
export default function PlaygroundPage() {
  const play = usePlayground();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <div className="pg-page">
      <header className="pg-top">
        <Link to={ROUTES.login} className="brand" aria-label="ChemQuote AI home">
          <span className="brand-icon"><BrandMark /></span>
          <span className="brand-wordmark">ChemQuote <em>AI</em></span>
        </Link>
        <div className="pg-top-actions">
          <QuotaPill usage={play.usage} />
          <IconButton icon={theme === "dark" ? Sun : Moon} label={`Switch to ${next} mode`} className="theme-switch" onClick={toggleTheme} />
          <Link to={user ? ROUTES.overview : ROUTES.login} className="btn primary">{user ? "Open the app" : "Sign in"}</Link>
        </div>
      </header>
      <main className="pg-main">
        <div className="pg-hero">
          <div className="eyebrow">AI PLAYGROUND</div>
          <h1>See how the AI reads an email</h1>
          <p>No sign-in needed. Add up to six products, write a customer email, and see what the AI finds, exactly as it does for your real inbox.</p>
        </div>
        <ProductsEditor
          products={play.products}
          problems={play.problems}
          canAdd={play.canAddProduct}
          onAdd={play.addProduct}
          onChange={play.changeProduct}
          onRemove={play.removeProduct}
        />
        <div className="pg-run">
          <EmailEditor email={play.email} error={play.problems.email} onChange={play.setEmail} />
          <div className="pg-run-center">
            <Button variant="primary" icon={play.status === "loading" ? undefined : Sparkles} busy={play.status === "loading"} busyLabel="Analyzing…" disabled={play.exhausted} onClick={play.analyze}>
              Analyze with AI <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button icon={RotateCcw} onClick={play.reset} disabled={play.status === "loading"}>Reset example</Button>
            {play.exhausted && <Link to={ROUTES.login} className="link">Out of free requests — sign in</Link>}
          </div>
          <ResultPanel status={play.status} result={play.result} error={play.error} exhausted={play.exhausted} />
        </div>
        <AccessNote />
      </main>
    </div>
  );
}
