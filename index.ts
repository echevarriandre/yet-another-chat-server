import { randomBytes } from "crypto";
import http from "http";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import InMemorySessionStore from "./sessionStore";
import { ClientToServerEvents, CS, SC, ServerToClientEvents, SocketData, User } from "./types";

const httpServer = http.createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>(httpServer, {
  cors: { origin: "*" },
});

const randomId = () => randomBytes(8).toString("hex");
const sessionStore = new InMemorySessionStore();

// Auth Middleware
io.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const session = sessionStore.findSession(sessionId);
    if (session) {
      socket.data.sessionId = sessionId;
      socket.data.userId = session.userId;
      socket.data.username = session.username;
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Invalid username"));
  }
  socket.data.sessionId = randomId();
  socket.data.userId = randomId();
  socket.data.username = username;
  next();
});

io.on("connection", (socket) => {
  // Send session data
  socket.emit(SC.Session, socket.data.sessionId!, socket.data.userId!);
  socket.join(socket.data.userId!);

  // Send connected users;
  const users = [] as User[];
  io.of("/").sockets.forEach((s) => {
    if (s.id === socket.id) return;
    users.push({ id: s.data.userId!, username: s.data.username! });
  });
  socket.emit(SC.Users, users);

  socket.broadcast.emit(SC.UserConnected, {
    id: socket.id,
    username: socket.data.username!,
  });

  socket.on(CS.Message, (message, to) => {
    socket.to(to).to(socket.data.userId!).emit(SC.Message, message, socket.id);
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.data.userId!).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit(SC.UserDisconnected, socket.data.userId!);
      // update the connection status of the session
      sessionStore.saveSession(socket.data.sessionId!, {
        userId: socket.data.userId!,
        username: socket.data.username!,
        connected: false,
      });
    }
  });
});

httpServer.listen(5000);
