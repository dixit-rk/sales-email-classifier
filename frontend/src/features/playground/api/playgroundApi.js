import { apiRequest } from "../../../shared/api/client";
import { getDeviceId } from "../../../shared/lib/deviceId";

const BASE = "/api/playground";
const ANALYZE_TIMEOUT_MS = 35000;

const withDevice = async (options = {}) => ({ ...options, headers: { "X-Device-Id": await getDeviceId() } });

/** How many free requests this device and network have left: `{ limit, remaining }`. */
export const fetchUsage = async (signal) => apiRequest(`${BASE}/usage`, await withDevice({ signal })).then((body) => body.data);

/** Runs the AI on a sample email and product list: `{ result, usage }`. */
export const analyzeEmail = async (payload) =>
  apiRequest(`${BASE}/analyze`, await withDevice({ method: "POST", body: payload, timeoutMs: ANALYZE_TIMEOUT_MS })).then((body) => body.data);
