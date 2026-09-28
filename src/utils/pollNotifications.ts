import type { Dispatch, SetStateAction } from "react";
import type { Chat, Credentials, Message, MessageStatus } from "../types";
import {
  deleteNotification,
  readChat,
  receiveNotification,
} from "../lib/greenApi";
import { extractIncoming } from "./extractIncoming";

type PollNotificationsParams = {
  credentials: Credentials;
  getActiveId: () => string | null;
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setConnected: Dispatch<SetStateAction<boolean>>;
};

type OutgoingStatus = "delivered" | "read" | "failed" | "noAccount";

function isOutgoingStatus(value: unknown): value is OutgoingStatus {
  return (
    value === "delivered" ||
    value === "read" ||
    value === "failed" ||
    value === "noAccount"
  );
}

export function pollNotifications({
  credentials,
  getActiveId,
  setChats,
  setConnected,
}: PollNotificationsParams): () => void {
  let stopped = false;

  let retryTimeout: ReturnType<typeof setTimeout> | null = null;

  async function poll(): Promise<void> {
    while (!stopped) {
      try {
        const notification = await receiveNotification(credentials, 10);

        if (stopped) {
          return;
        }
        setConnected(true);

        if (!notification) {
          continue;
        }

        const body = notification?.body;
        const activeId = getActiveId();
        
        /* ВХОДЯЩЕЕ СООБЩЕНИЕ*/
        if (body?.typeWebhook === "incomingMessageReceived") {
          const incoming = extractIncoming(notification);

          if (incoming) {
            const incomingChatId = String(incoming.chatId);
            const normalizedIncomingId = incomingChatId.replace("@c.us", "");
            const normalizedActiveId = activeId?.replace("@c.us", "");
            const isActiveChat = normalizedIncomingId === normalizedActiveId;

            setChats((prev) => {
              const existing = prev.find((chat) => {
                const chatId = String(chat.id);
                return (
                  chatId === incomingChatId ||
                  chatId.replace("@c.us", "") === normalizedIncomingId
                );
              });

              const message: Message = {
                id: `in-${incoming.timestamp}-${Math.random()}`,
                text: incoming.text,
                direction: "incoming",
                timestamp: incoming.timestamp,
                status: "sent",
              };

              if (existing) {
                return prev.map((chat) => {
                  if (chat.id !== existing.id) {
                    return chat;
                  }

                  return {
                    ...chat,
                    messages: [...chat.messages, message],
                    updatedAt: Date.now(),
                    unreadCount: isActiveChat ? 0 : chat.unreadCount + 1,
                  };
                });
              }

              const phone = incomingChatId.replace("@c.us", "");
              return [
                {
                  id: incomingChatId,
                  phone,
                  title: `+${phone}`,
                  messages: [message],
                  updatedAt: Date.now(),
                  unreadCount: isActiveChat ? 0 : 1,
                },
                ...prev,
              ];
            });
            if (isActiveChat) {
              try {
                const result = await readChat(credentials, incomingChatId);
                if (result?.setRead !== true) {
                  console.warn("GREEN-API не подтвердил readChat", result);
                }
              } catch (error) {
                console.error("GREEN-API readChat error:", error);
              }
            }
          }
        }
        /* ИСХОДЯЩЕЕ СООБЩЕНИЕ*/
        if (body?.typeWebhook === "outgoingMessageStatus") {
          const messageId = body?.idMessage;
          const status = body?.status;
          const description = body?.description;
          if (messageId && isOutgoingStatus(status)) {
            setChats((prev) =>
              prev.map((chat) => ({
                ...chat,
                messages: chat.messages.map((message) => {
                  if (message.greenApiId !== messageId) {
                    return message;
                  }
                  const nextStatus: MessageStatus = status;
                  return {
                    ...message,
                    status: nextStatus,
                    errorDescription:
                      status === "failed" || status === "noAccount"
                        ? description
                        : undefined,
                  };
                }),
              })),
            );
          }
        }

        /* ПОДТВЕРЖДАЕМ ОБРАБОТКУ */

        if (notification.receiptId !== undefined) {
          await deleteNotification(credentials, notification.receiptId);
        }
      } catch (error) {
        if (stopped) {
          return;
        }
        setConnected(false);

        await new Promise<void>((resolve) => {
          retryTimeout = setTimeout(() => {
            retryTimeout = null;
            resolve();
          }, 3000);
        });
      }
    }
  }

  void poll();

  return () => {
    stopped = true;
    if (retryTimeout !== null) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
  };
}
