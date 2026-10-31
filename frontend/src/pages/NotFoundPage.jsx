import { Link } from "react-router-dom";
import { EmptyState } from "../shared/ui";
import { ROUTES } from "../shared/routes";

/** Catch-all for unknown URLs. */
export default function NotFoundPage() {
  return (
    <div className="content">
      <EmptyState title="Page not found" hint={<Link to={ROUTES.inbox}>Go to the pricing inbox</Link>} />
    </div>
  );
}
