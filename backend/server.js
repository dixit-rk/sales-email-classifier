require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const authRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const gmailRoutes = require("./routes/gmailRoutes");
const emailRoutes = require("./routes/emailRoutes");
const statsRoutes = require("./routes/statsRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const playgroundRoutes = require("./routes/playgroundRoutes");
const playgroundConfig = require("./config/playground");
const { sessionCookieOptions } = require("./config/session");
const { initRealtime } = require("./services/realtimeService");
const { startWatchRenewal } = require("./services/gmailWatchService");
const { HttpError } = require("./utils/httpError");

const app = express();

if (process.env.NODE_ENV === "production" && playgroundConfig.trustedProxyHops() === 0) {
    console.warn("NODE_ENV=production uses secure cookies, which need TRUST_PROXY_HOPS (usually 1) behind a hosting proxy; without it sign-in will not stick.");
}

// How many proxies sit in front of this server (0 = none). Needed to read each visitor's real network address.
app.set("trust proxy", playgroundConfig.trustedProxyHops());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: sessionCookieOptions()
});

app.use(sessionMiddleware);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Email Classifier API running!" });
});

app.use("/webhooks", webhookRoutes);

app.use("/api/gmail", gmailRoutes);

app.use("/api/emails", emailRoutes);

app.use("/api/stats", statsRoutes);

app.use("/api/catalog", catalogRoutes);

app.use("/api/playground", playgroundRoutes);

app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({
        message: "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

// Listen first so the host sees the app start straight away; database calls wait for the connection.
const server = http.createServer(app);

initRealtime(server, {
    origin: process.env.FRONTEND_URL,
    sessionMiddleware
});

server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected!");

        startWatchRenewal();
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });
