const HEX_DIGITS = 8;

function cyrb128(text, seed) {
  let h1 = 1779033703 ^ seed;
  let h2 = 3144134277 ^ seed;
  let h3 = 1013904242 ^ seed;
  let h4 = 2773480762 ^ seed;

  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ code, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ code, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ code, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ code, 2716044179);
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

/** 64 hex characters from a text, with the browser's SHA-256 when available (secure pages) and a built-in hash otherwise. */
async function digest(text) {
  if (globalThis.crypto?.subtle) {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));

    return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return [...cyrb128(text, 1), ...cyrb128(text, 2)].map((part) => part.toString(16).padStart(HEX_DIGITS, "0")).join("");
}

function graphicsCard() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");

    return info ? `${gl.getParameter(info.UNMASKED_VENDOR_WEBGL)}|${gl.getParameter(info.UNMASKED_RENDERER_WEBGL)}` : "";
  } catch {
    return "";
  }
}

/** Hardware and system traits that stay the same across networks, browser zoom and screen rotation. */
function traits() {
  const { width, height, colorDepth } = window.screen;

  return [
    navigator.userAgentData?.platform ?? navigator.platform,
    navigator.hardwareConcurrency,
    navigator.deviceMemory,
    navigator.maxTouchPoints,
    Math.max(width, height),
    Math.min(width, height),
    colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    graphicsCard(),
  ].join("|");
}

let deviceId = null;

/**
 * An anonymous id for this device: a SHA-256 of its hardware traits (a browser cannot read a MAC address).
 * It is computed on demand and stored nowhere, so clearing cookies or site data does not change it.
 */
export function getDeviceId() {
  deviceId ??= digest(traits());

  return deviceId;
}
