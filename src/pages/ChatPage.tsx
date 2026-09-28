import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChatHeader,
  Composer,
  MessageList,
  NewChatModal,
  Sidebar,
} from "../components";

import {
  clearChats,
  loadChats,
  loadCredentials,
  saveChats,
} from "../lib/storage";

import type { Chat, Credentials } from "../types";

import {
  createChat,
  handleKeyDown,
  logout,
  pollNotifications,
  selectChat,
  sendChatMessage,
} from "../utils";

export function ChatPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials | null>(
    loadCredentials(),
  );
  const [chats, setChats] = useState<Chat[]>(loadChats());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [mobileList, setMobileList] = useState(true);
  const activeIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const active = chats.find((chat) => chat.id === activeId) || null;

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return chats
      .filter(
        (chat) => !q || `${chat.title} ${chat.phone}`.toLowerCase().includes(q),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [chats, query]);

 
  useEffect(() => {
    if (!credentials) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [credentials, navigate]);

  /* Сохраняем чаты */
  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  /* Получение входящих сообщений */
  useEffect(() => {
    if (!credentials) {
      return;
    }

    const stopPolling = pollNotifications({
      credentials,
      getActiveId: () => activeIdRef.current,
      setChats,
      setConnected,
    });

    return stopPolling;
  }, [credentials]);

  /* Автоматический скролл вниз */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [active?.messages.length]);

  /* Выход */
  const handleLogout = () => {
    logout({
      setCredentials,
      setConnected,
      setActiveId,
      setDraft: () => {},
    });

    navigate("/login", {
      replace: true,
    });
  };

  /* Выбор чата */
  const handleSelect = (id: string) => {
    if (!credentials) {
      return;
    }

    void selectChat({
      id,
      credentials,
      setActiveId,
      setMobileList,
      setChats,
      setError,
    });
  };

  /* Создание нового чата */
  const handleCreate = () => {
    createChat({
      phone,
      chats,
      setChats,
      setActiveId,
      setMobileList,
      setPhone,
      setNewChatOpen,
      setError,
    });
  };

  /* Отправка сообщения */
  const handleSend = () => {
    if (!active || !credentials) {
      return;
    }

    void sendChatMessage({
      text: message,
      activeChat: active,
      credentials,
      setMessage,
      setChats,
      setError,
    });
  };

  if (!credentials) {
    return null;
  }

  return (
    <div className="app-shell">
      <Sidebar
        chats={filtered}
        activeId={activeId}
        query={query}
        connected={connected}
        mobileList={mobileList}
        onQuery={setQuery}
        onSelect={handleSelect}
        onNew={() => {
          setError("");
          setNewChatOpen(true);
        }}
        onLogout={handleLogout}
      />

      <main className="chat-panel">
        {!active ? (
          <div className="welcome">
            <div className="welcome-icon">💬</div>

            <h2>Выберите чат</h2>

            <p>Создайте новый чат и начните переписку.</p>

            <button
              className="primary"
              onClick={() => {
                setError("");
                setNewChatOpen(true);
              }}
            >
              ＋ Новый чат
            </button>
          </div>
        ) : (
          <>
            <ChatHeader chat={active} onBack={() => setMobileList(true)} />

            <MessageList chat={active} bottomRef={bottomRef} />

            {error && (
              <div className="inline-error">
                {error}

                <button onClick={() => setError("")}>×</button>
              </div>
            )}

            <Composer
              value={message}
              onChange={setMessage}
              onSend={handleSend}
              onKeyDown={(event) =>
                handleKeyDown({
                  event,
                  onSend: handleSend,
                })
              }
            />
          </>
        )}
      </main>

      {newChatOpen && (
        <NewChatModal
          phone={phone}
          setPhone={setPhone}
          error={error}
          onClose={() => {
            setNewChatOpen(false);
            setError("");
          }}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
