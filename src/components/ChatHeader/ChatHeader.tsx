import { ChevronLeft, MoreHorizontal } from "lucide-react";
import type { Chat } from "../../types";
import "./ChatHeader.css";
export function ChatHeader({
  chat,
  onBack,
}: {
  chat: Chat;
  onBack: () => void;
}) {
  return (
    <header className="chat-header">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft />
      </button>
      <div className="avatar">
        {chat.title.replace(/\D/g, "").slice(-2) || "?"}
      </div>
      <div>
        <strong>{chat.title}</strong>
        <small>{chat.phone}</small>
      </div>
      <button className="icon-btn header-more">
        <MoreHorizontal />
      </button>
    </header>
  );
}
