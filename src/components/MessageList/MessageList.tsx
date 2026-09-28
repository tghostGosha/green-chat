import { Check, CheckCheck } from "lucide-react";
import type { RefObject } from "react";
import type { Chat } from "../../types";
import { formatTime } from "../../utils";
import "./MessageList.css";
export function MessageList({
  chat,
  bottomRef,
}: {
  chat: Chat;
  bottomRef: RefObject<HTMLDivElement>;
}) {
  return (
    <section className="messages">
      {chat.messages.length === 0 && (
        <div className="conversation-empty">
          <div className="welcome-icon">💬</div>
          <strong>Начните диалог</strong>
          <span>Сообщения появятся здесь.</span>
        </div>
      )}
      {chat.messages.map((m) => (
        <div key={m.id} className={`message-wrap ${m.direction}`}>
          <div
            className={`message ${m.status === "noAccount" ? "failed" : ""}`}
          >
            <span>{m.text}</span>
            <div className="message-meta">
              <time>{formatTime(m.timestamp)}</time>
              {m.direction === "outgoing" &&
                (m.status === "sending" ? (
                  <Check size={13} />
                ) : m.status === "read" ? (
                  <CheckCheck className="read-check" size={14} />
                ) : m.status === "noAccount" ? (
                  <span>!</span>
                ) : (
                  <Check size={13} />
                ))}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </section>
  );
}
