export type IncomingMessage = {
  chatId: string;
  text: string;
  timestamp: number;
};

export function extractIncoming(notification: any): IncomingMessage | null {
  const body = notification?.body;

  if (body?.typeWebhook !== "incomingMessageReceived") {
    return null;
  }

  const messageData = body?.messageData;

  const text =
    messageData?.textMessageData?.textMessage ||
    messageData?.extendedTextMessageData?.text ||
    "";

  const chatId =
    body?.senderData?.chatId || body?.chatId || body?.senderData?.sender || "";

  if (
    typeof text !== "string" ||
    !text.trim() ||
    typeof chatId !== "string" ||
    !chatId.trim()
  ) {
    return null;
  }

  const timestamp = Number(body?.timestamp);

  return {
    chatId,

    text,

    timestamp:
      Number.isFinite(timestamp) && timestamp > 0
        ? timestamp * 1000
        : Date.now(),
  };
}
