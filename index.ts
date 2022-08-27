import { Server } from "socket.io";

interface ServerToClientEvents {
  disconnect: () => void;
  "chat-new-user": (user: User) => void;
}

interface ClientToServerEvents {
  "chat-connect": (username: string) => void;
  "chat-fetch-users": (callback: (users: User[]) => void) => void;
}

interface User {
  id: string;
  username: string;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(5000, {
  cors: {
    origin: "*",
  },
});

const users = new Map();

function getUsers(filterOutId: string = ""): User[] {
  const usersJson: User[] = [];
  users.forEach((username, id) => {
    if (id !== filterOutId) usersJson.push({ id: id, username: username });
  });
  return usersJson;
}

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.on("chat-connect", (username: string) => {
    users.set(socket.id, username);
    socket.broadcast.emit("chat-new-user", { id: socket.id, username });
  });

  socket.on("chat-fetch-users", (callback) => {
    callback(getUsers(socket.id));
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
    users.delete(socket.id);
  });
});
