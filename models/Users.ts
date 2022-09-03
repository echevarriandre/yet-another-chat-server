import { User } from "../@types";

export class Users {
  users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  getUsers(filterOutId: string): User[] {
    const usersJson: User[] = [];
    this.users.forEach((userDetails, id) => {
      if (id !== filterOutId && !userDetails.chatting)
        usersJson.push({ id: id, username: userDetails.username, chatting: userDetails.chatting });
    });
    return usersJson;
  }

  addUser(id: string, username: string): void {
    this.users.set(id, { id: id, username: username, chatting: false });
  }

  deleteUser(id: string): void {
    this.users.delete(id);
  }

  getUsernameById(id: string): string | undefined {
    const user = this.users.get(id);
    if (!user) return;

    return user.username;
  }
}
