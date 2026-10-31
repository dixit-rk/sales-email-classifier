import { apiRequest } from "../../../shared/api/client";
import { API_URL } from "../../../shared/config";

export const googleLoginUrl = `${API_URL}/auth/google`;

/** Current session user; rejects with a 401 ApiError when signed out. */
export const fetchCurrentUser = (signal) => apiRequest("/auth/me", { signal }).then((body) => body.user);

/** Saves the display name (empty resets to the Google name) and returns the updated user. */
export const updateProfile = (displayName) =>
  apiRequest("/auth/me", { method: "PATCH", body: { displayName } }).then((body) => body.user);

/** Ends the session. */
export const logout = () => apiRequest("/auth/logout", { method: "POST" });
