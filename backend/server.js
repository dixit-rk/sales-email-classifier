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
const { initRealtime } = require("./services/realtimeService");
const { HttpError } = require("./utils/httpError");

const app = express();

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
    cookie: {
        httpOnly: true,
        secure: false, // Local HTTP development only
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
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

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected!");

        const server = http.createServer(app);

        initRealtime(server, {
            origin: process.env.FRONTEND_URL,
            sessionMiddleware
        });

        server.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });