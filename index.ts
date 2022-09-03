import { Server } from "socket.io";
import {
  ClientServerEventNames as CS,
  ClientToServerEvents,
  ServerClientEventNames as SC,
  ServerToClientEvents,
} from "./@types";
import { Users } from "./models/Users";

const io = new Server<ClientToServerEvents, ServerToClientEvents>(5000, { cors: { origin: "*" } });

const activeUsers = new Users();

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.on(CS.ChatConnect, (username: string) => {
    activeUsers.addUser(socket.id, username);
    socket.broadcast.emit(SC.ChatNewUser, { id: socket.id, username, chatting: false });
  });

  socket.on(CS.ChatFetchUsers, (callback) => {
    callback(activeUsers.getUsers(socket.id));
  });

  socket.on(CS.ChatAskUser, (id: string) => {
    const username = activeUsers.getUsernameById(id);
    const currentUser = activeUsers.getUsernameById(socket.id);
    if (!username) {
      socket.emit(SC.ChatAskUserNotFound, "Username not found");
      return;
    }

    socket.to(id).emit(SC.ChatUserRequest, currentUser!);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
    activeUsers.deleteUser(socket.id);
    socket.broadcast.emit(SC.ChatRemoveUser, socket.id);
  });
});
