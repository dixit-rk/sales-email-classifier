import { UNCLEAR_PRODUCT } from "../constants";

/** Product names for display, or a placeholder when the AI found none. */
export const productLabel = (email) =>
  email.products.length ? email.products.map((product) => product.name).join(", ") : UNCLEAR_PRODUCT;

/** Link that opens the email's thread in Gmail. */
export const gmailThreadUrl = (email) => `https://mail.google.com/mail/u/0/#all/${email.threadId}`;
