import { API_URL, REQUEST_TIMEOUT_MS } from "../config";

const UNAUTHORIZED = 401;
const NO_CONTENT = 204;
const NETWORK_ERROR_STATUS = 0;

/** Error from the API carrying the HTTP status; status 0 means the server was unreachable. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  get isUnauthorized() {
    return this.status === UNAUTHORIZED;
  }
}

const buildUrl = (path, params) => {
  const url = new URL(path, API_URL);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== "" && value != null) url.searchParams.set(key, value);
  }

  return url;
};

const readMessage = async (response) => {
  try {
    return (await response.json()).message;
  } catch {
    return undefined;
  }
};

/**
 * Request to the backend with the session cookie and a timeout; abort errors pass through.
 * A plain object body is sent as JSON, a FormData body as a file upload; `asBlob` returns a download;
 * `timeoutMs` overrides the default wait.
 */
export async function apiRequest(path, { method = "GET", params, body, signal, asBlob = false, headers, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const timeout = AbortSignal.timeout(timeoutMs);
  const isUpload = body instanceof FormData;
  let response;

  try {
    response = await fetch(buildUrl(path, params), {
      method,
      credentials: "include",
      cache: "no-store",
      headers: { ...(body && !isUpload ? { "Content-Type": "application/json" } : {}), ...headers },
      body: body && !isUpload ? JSON.stringify(body) : body,
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(NETWORK_ERROR_STATUS, "Cannot reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, (await readMessage(response)) ?? "Something went wrong.");
  }

  if (response.status === NO_CONTENT) return null;

  return asBlob ? response.blob() : response.json();
}
