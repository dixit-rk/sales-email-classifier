const { Server } = require("socket.io");

const EMAIL_CLASSIFIED_EVENT = "email:classified";

let io = null;

const userRoom = (userId) => `user:${userId}`;

/** Attaches Socket.IO to the HTTP server and puts each logged-in socket in its user's room. */
function initRealtime(httpServer, { origin, sessionMiddleware }) {
    io = new Server(httpServer, { cors: { origin, credentials: true } });

    io.engine.use(sessionMiddleware);

    io.use((socket, next) => {
        const userId = socket.request.session?.userId;

        if (!userId) return next(new Error("Not authenticated"));

        socket.join(userRoom(userId));
        next();
    });

    return io;
}

/** Pushes an event to every open browser tab of one user; no-op before init. */
function emitToUser(userId, event, payload) {
    io?.to(userRoom(String(userId))).emit(event, payload);
}

module.exports = { initRealtime, emitToUser, EMAIL_CLASSIFIED_EVENT };
