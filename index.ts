import http from "http";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, CS, SC, ServerToClientEvents, SocketData, User } from "./types";

const httpServer = http.createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>(httpServer, {
  cors: { origin: "*" },
});

// Auth Middleware
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) return next(new Error("Username is required"));

  socket.data.username = username;
  next();
});

io.on("connection", (socket) => {
  // Send connected users;
  const users = [] as User[];
  io.of("/").sockets.forEach((s) => {
    if (s.id === socket.id) return;
    users.push({ id: s.id, username: s.data.username! });
  });
  socket.emit(SC.Users, users);

  socket.broadcast.emit(SC.UserConnected, {
    id: socket.id,
    username: socket.data.username!,
  });

  socket.on(CS.Message, (message, to) => {
    socket.to(to).emit(SC.Message, message, socket.id);
  });

  socket.on("disconnect", () => {
    // activeUsers.deleteUser(socket.id);
    // socket.broadcast.emit(SC.ChatRemoveUser, socket.id);
  });
});

httpServer.listen(5000);
