const config = require("../config/playground");
const { normalizeIp, parseDeviceId } = require("../utils/clientIdentity");
const { parsePlaygroundRequest } = require("../utils/playgroundInput");
const playgroundService = require("../services/playgroundService");

let warnedAboutProxy = false;

/** Who is asking: the browser's device id and the network the request came from. */
function identify(req) {
    if (!warnedAboutProxy && req.get("x-forwarded-for") && config.trustedProxyHops() === 0) {
        warnedAboutProxy = true;
        console.warn("X-Forwarded-For is present but TRUST_PROXY_HOPS is 0: behind a proxy every visitor shares one network address. Set TRUST_PROXY_HOPS to the number of proxies in front of this server.");
    }

    return { deviceId: parseDeviceId(req.get("x-device-id")), ip: normalizeIp(req.ip) };
}

exports.usage = async (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ data: await playgroundService.getUsage(identify(req)) });
};

exports.analyze = async (req, res) => {
    const identity = identify(req);
    const input = parsePlaygroundRequest(req.body);

    res.set("Cache-Control", "no-store");
    res.json({ data: await playgroundService.analyze(identity, input) });
};
