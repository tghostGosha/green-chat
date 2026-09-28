import type { Chat, Credentials } from "../types";

const CREDENTIALS_KEY = "green-api-credentials";

const CHATS_KEY = "green-api-chats";

export function loadCredentials(): Credentials | null {
  try {
    const value = localStorage.getItem(CREDENTIALS_KEY);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as Credentials;
  } catch {
    return null;
  }
}

export function saveCredentials(credentials: Credentials): void {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

export function clearCredentials(): void {
  localStorage.removeItem(CREDENTIALS_KEY);
}

export function loadChats(): Chat[] {
  try {
    const value = localStorage.getItem(CHATS_KEY);

    if (!value) {
      return [];
    }

    return JSON.parse(value) as Chat[];
  } catch {
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function clearChats(): void {
  localStorage.removeItem(CHATS_KEY);
}
