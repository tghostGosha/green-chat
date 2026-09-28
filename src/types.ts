export type Credentials = {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
};

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "noAccount";

export type Message = {
  id: string;
  text: string;
  direction: "incoming" | "outgoing";
  timestamp: number;
  status: MessageStatus;
  greenApiId?: string;
  errorDescription?: string;
};

export type Chat = {
  id: string;
  phone: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  unreadCount: number;
};