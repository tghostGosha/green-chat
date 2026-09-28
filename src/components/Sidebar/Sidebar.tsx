import {
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Wifi,
  WifiOff,
} from "lucide-react";
import SidebarProps from "./SidebarProps";
import "./sidebar.css";
function time(ts: number) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(ts);
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside className={`sidebar ${props.mobileList ? "mobile-visible" : ""}`}>
      <header className="sidebar-header">
        <div className="brand">
          <div className="brand-mark small">
            <MessageCircle size={19} />
          </div>
          <strong>Green Chat</strong>
        </div>
        <button className="icon-btn" title="Новый чат" onClick={props.onNew}>
          <Plus />
        </button>
      </header>
      <div className="search">
        <Search size={18} />
        <input
          placeholder="Поиск"
          value={props.query}
          onChange={(e) => props.onQuery(e.target.value)}
        />
      </div>
      <div className="connection">
        {props.connected ? <Wifi size={15} /> : <WifiOff size={15} />}
        <span>{props.connected ? "Подключено" : "Ожидание подключения"}</span>
        <button title="Выйти" onClick={props.onLogout}>
          <LogOut size={15} />
        </button>
      </div>
      <div className="chat-list">
        {props.chats.length === 0 ? (
          <div className="empty-list">
            Нет чатов.
            <br />
            Нажмите +, чтобы создать.
          </div>
        ) : (
          props.chats.map((chat) => {
            const last = chat.messages[chat.messages.length - 1];
            return (
              <button
                key={chat.id}
                className={`chat-item ${chat.id === props.activeId ? "active" : ""}`}
                onClick={() => props.onSelect(chat.id)}
              >
                <div className="avatar">
                  {chat.title.replace(/\D/g, "").slice(-2) || "?"}
                </div>
                <div className="chat-info">
                  <div className="chat-row">
                    <strong>{chat.title}</strong>
                    <time>{last ? time(last.timestamp) : ""}</time>
                  </div>
                  <div className="chat-row">
                    <span>{last?.text || "Новый чат"}</span>
                    <div className="chat-meta">
                      {last?.direction === "outgoing" && (
                        <span className="checks">
                          {last.status === "read" ? "✓✓" : "✓"}
                        </span>
                      )}
                      {chat.unreadCount > 0 && (
                        <b className="unread-badge">
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </b>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
