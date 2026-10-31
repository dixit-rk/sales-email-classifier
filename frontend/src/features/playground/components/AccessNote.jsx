import { ShieldCheck } from "lucide-react";

/** Why the real app asks for Gmail access, and how the free playground is kept fair. */
export function AccessNote() {
  return (
    <aside className="pg-note">
      <span className="stat-icon"><ShieldCheck aria-hidden="true" /></span>
      <div>
        <h2>Why does the app ask for Gmail access?</h2>
        <p>
          When you sign in, ChemQuote asks Google for the <b>gmail.modify</b> permission. It uses it for two things only: reading each
          new email so the AI can find the product and amount, and adding a label to the emails that are price requests. This playground
          shows that same reading on text you type. It never connects to any inbox.
        </p>
        <p className="pg-fine">
          To keep this free demo fair, requests are counted per device and per network. Both are kept only as anonymous codes, never as
          your address or device details, and nothing you type is stored.
        </p>
      </div>
    </aside>
  );
}
