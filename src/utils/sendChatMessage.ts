import type { Dispatch, SetStateAction } from "react";
import type { Chat, Credentials } from "../types";
import { sendMessage } from "../lib/greenApi";

type SendChatMessageParams = {
  text: string;
  activeChat: Chat;
  credentials: Credentials;
  setMessage: Dispatch<SetStateAction<string>>;
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setError: Dispatch<SetStateAction<string>>;
};

export async function sendChatMessage({
  text,
  activeChat,
  credentials,
  setMessage,
  setChats,
  setError,
}: SendChatMessageParams): Promise<void> {
  const messageText = text.trim();

  if (!messageText) {
    return;
  }

  const localId = `out-${Date.now()}-${Math.random()}`;

  setMessage("");

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === activeChat.id
        ? {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: localId,
                text: messageText,
                direction: "outgoing",
                timestamp: Date.now(),
                status: "sending",
              },
            ],
            updatedAt: Date.now(),
          }
        : chat,
    ),
  );

  try {
    const response = await sendMessage(credentials, activeChat.id, messageText);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: chat.messages.map((message) =>
                message.id === localId
                  ? {
                      ...message,
                      status: "sent",
                      greenApiId: response.idMessage,
                    }
                  : message,
              ),
            }
          : chat,
      ),
    );
  } catch (error) {
    console.error("GREEN-API sendMessage error:", error);

    setError(
      "Не удалось получить подтверждение от GREEN-API. Проверьте соединение.",
    );
  }
}
