import { useAsyncResource } from "../../../shared/hooks/useAsyncResource";
import { fetchConnection } from "../api/gmailApi";

/** Live Gmail connection status. It is asked from Google on every visit and on `reload`, never remembered. */
export const useConnection = () => useAsyncResource("gmail-connection", fetchConnection);
