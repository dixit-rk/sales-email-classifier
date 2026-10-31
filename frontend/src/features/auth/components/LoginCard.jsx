import { ArrowRight, FlaskConical, Moon, ShieldCheck, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark, IconButton } from "../../../shared/ui";
import { useTheme } from "../../../shared/theme/themeContext";
import { ROUTES } from "../../../shared/routes";
import { googleLoginUrl } from "../api/authApi";
import "./login.css";

/** Right login panel with the Google sign-in button and theme switch. */
export function LoginCard() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <section className="login-main">
      <div className="login-theme">
        <IconButton icon={theme === "dark" ? Sun : Moon} label={`Switch to ${next} mode`} className="theme-switch" onClick={toggleTheme} />
      </div>
      <div className="login-card">
        <div className="mobile-brand brand">
          <span className="brand-icon"><BrandMark /></span>
          <span className="brand-wordmark">ChemQuote <em>AI</em></span>
        </div>
        <div className="welcome-label">WELCOME TO YOUR WORKSPACE</div>
        <h2>Welcome back<span className="period">.</span></h2>
        <p>Sign in to <strong>ChemQuote AI</strong> to manage every high‑value chemical pricing inquiry in one place.</p>
        <a className="google-btn" href={googleLoginUrl}>
          <span className="google-g">G</span>
          <span>Continue with Google</span>
          <ArrowRight size={17} aria-hidden="true" />
        </a>
        <div className="login-trust"><ShieldCheck size={15} aria-hidden="true" /> Secure Google account connection</div>
        <div className="login-divider"><span>or</span></div>
        <Link to={ROUTES.playground} className="playground-link">
          <FlaskConical size={20} aria-hidden="true" />
          <span>Try the AI playground<small>No sign-in needed. See what the AI does with an email.</small></span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <div className="fine">ChemQuote asks for Gmail access (the gmail.modify permission) only to read new emails and add a label. You can revoke it from your Google account at any time. By continuing you agree to the <Link to={ROUTES.terms}>Terms</Link> and <Link to={ROUTES.privacy}>Privacy Policy</Link>.</div>
      </div>
      <div className="login-footer">
        © 2026 ChemQuote AI <span>·</span> <Link to={ROUTES.privacy}>Privacy</Link> <span>·</span> <Link to={ROUTES.terms}>Terms</Link>
      </div>
    </section>
  );
}
