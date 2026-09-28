import type { Chat } from "../types";
import type { Dispatch, SetStateAction } from "react";
import { normalizePhone } from "./normalizePhone";
import { toChatId } from "./toChatId";

type CreateChatParams = {
  phone: string;
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setActiveId: Dispatch<SetStateAction<string | null>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setNewChatOpen: Dispatch<SetStateAction<boolean>>;
  setMobileList: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
};

export function createChat({
  phone,
  chats,
  setChats,
  setActiveId,
  setPhone,
  setNewChatOpen,
  setMobileList,
  setError,
}: CreateChatParams): void {
  const normalized = normalizePhone(phone);

  if (!normalized) {
    setError("Введите номер телефона.");
    return;
  }

  const id = toChatId(normalized);

  const existing = chats.find((chat) => chat.id === id);

  if (existing) {
    setActiveId(existing.id);
  } else {
    const chat: Chat = {
      id,
      phone: normalized,
      title: `+${normalized}`,
      messages: [],
      updatedAt: Date.now(),
      unreadCount: 0,
    };

    setChats((prev) => [chat, ...prev]);
    setActiveId(id);
  }

  setPhone("");
  setNewChatOpen(false);
  setMobileList(false);
  setError("");
}
