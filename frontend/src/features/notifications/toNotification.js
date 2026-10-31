import { ROUTES } from "../../shared/routes";

/** Turns a pushed email into a notification: what happened and where to look. */
export function toNotification(email) {
  const needsReview = email.needsReview && !email.reviewDecision;

  return {
    id: email.id,
    title: needsReview ? "Email needs review" : "New pricing inquiry",
    message: `${email.fromName} · ${email.subject || "(no subject)"}`,
    to: needsReview ? ROUTES.review : `${ROUTES.inbox}?id=${email.id}`,
    receivedAt: email.receivedAt,
    read: false,
  };
}
