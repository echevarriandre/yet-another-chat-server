export interface SocketData {
  username: string;
  sessionId: string;
  userId: string;
}

export enum SC {
  Users = "users",
  UserConnected = "user connected",
  UserDisconnected = "user disconnected",
  Message = "message",
  Session = "session",
}
export interface ServerToClientEvents {
  disconnect: () => void;
  [SC.Users]: (users: User[]) => void;
  [SC.UserConnected]: (user: User) => void;
  [SC.UserDisconnected]: (userId: string) => void;
  [SC.Message]: (message: string, from: string) => void;
  [SC.Session]: (sessionId: string, userId: string) => void;
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

export interface Session {
  userId: string;
  username: string;
  connected: boolean;
}

export interface ISessionStorage {
  sessions: Map<string, Session>;
  findSession: (id: string) => Session | null;
  saveSession: (id: string, session: Session) => void;
  findAllSessions: () => Session[];
}
