import { ISessionStorage, Session } from "./types";

class InMemorySessionStore implements ISessionStorage {
  sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: string) {
    const session = this.sessions.get(id);
    if (!session) return null;
    return session;
  }

  saveSession(id: string, session: Session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

export default InMemorySessionStore;
