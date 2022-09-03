export enum ServerClientEventNames {
  ChatNewUser = "chat-new-user",
  ChatUserRequest = "chat-user-request",
  ChatAskUserNotFound = "chat-ask-user-notfound",
  ChatRemoveUser = "chat-remove-user",
}

export enum ClientServerEventNames {
  ChatConnect = "chat-connect",
  ChatAskUser = "chat-ask-user",
  ChatFetchUsers = "chat-fetch-users",
  ChatAcceptRequest = "chat-accept-request",
}

export interface ServerToClientEvents {
  disconnect: () => void;
  [ServerClientEventNames.ChatNewUser]: (user: User) => void;
  [ServerClientEventNames.ChatUserRequest]: (username: string) => void;
  [ServerClientEventNames.ChatAskUserNotFound]: (reason: string) => void;
  [ServerClientEventNames.ChatRemoveUser]: (id: string) => void;
}

export interface ClientToServerEvents {
  [ClientServerEventNames.ChatConnect]: (username: string) => void;
  [ClientServerEventNames.ChatAskUser]: (id: string) => void;
  [ClientServerEventNames.ChatFetchUsers]: (callback: (users: User[]) => void) => void;
  [ClientServerEventNames.ChatAcceptRequest]: (callback: (chatId: string) => void) => void;
}

export interface User {
  id: string;
  username: string;
  chatting: boolean;
}
