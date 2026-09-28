import type { Dispatch, SetStateAction } from "react";
import type { Chat, Credentials } from "../types";
import { readChat } from "../lib/greenApi";

type SelectChatParams = {
  id: string;
  credentials: Credentials;
  setActiveId: Dispatch<SetStateAction<string | null>>;
  setMobileList: Dispatch<SetStateAction<boolean>>;
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setError: Dispatch<SetStateAction<string>>;
};

export async function selectChat({
  id,
  credentials,
  setActiveId,
  setMobileList,
  setChats,
  setError,
}: SelectChatParams): Promise<void> {
  setActiveId(id);
  setMobileList(false);
  setChats((prev) =>
    prev.map((chat) =>
      chat.id === id
        ? {
            ...chat,
            unreadCount: 0,
          }
        : chat,
    ),
  );

  try {
    await readChat(credentials, id);
  } catch (error) {
    console.error("GREEN-API readChat error:", error);
    setError(
      error instanceof Error
        ? error.message
        : "Не удалось отметить сообщения как прочитанные.",
    );
  }
}
