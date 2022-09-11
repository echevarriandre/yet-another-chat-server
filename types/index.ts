export interface SocketData {
  username: string;
}

export enum SC {
  Users = "users",
  UserConnected = "user connected",
  Message = "message",
}
export interface ServerToClientEvents {
  disconnect: () => void;
  [SC.Users]: (users: User[]) => void;
  [SC.UserConnected]: (user: User) => void;
  [SC.Message]: (message: string, from: string) => void;
}

export enum CS {
  Message = "message",
}
export interface ClientToServerEvents {
  [CS.Message]: (message: string, to: string) => void;
}

export interface User {
  id: string;
  username: string;
}
