import type { Credentials } from "../types";

const base = (credentials: Credentials) =>
  credentials.apiUrl.replace(/\/+$/, "");

const endpoint = (credentials: Credentials, path: string) =>
  `${base(credentials)}/waInstance${encodeURIComponent(
    credentials.idInstance,
  )}/${path}/${encodeURIComponent(credentials.apiTokenInstance)}`;

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
) {
  const response = await fetch(endpoint(credentials, "sendMessage"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `HTTP ${response.status}`);
  }

  return response.json() as Promise<{
    idMessage: string;
  }>;
}

export async function receiveNotification(
  credentials: Credentials,
  receiveTimeout = 10,
) {
  const response = await fetch(
    endpoint(credentials, "receiveNotification") +
      `?receiveTimeout=${receiveTimeout}`,
  );

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error((await response.text()) || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: string | number,
) {
  const response = await fetch(
    `${base(credentials)}/waInstance${encodeURIComponent(
      credentials.idInstance,
    )}/deleteNotification/${encodeURIComponent(
      credentials.apiTokenInstance,
    )}/${encodeURIComponent(String(receiptId))}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error((await response.text()) || `HTTP ${response.status}`);
  }
}

/* Пометить сообщения чата прочитанными. */
export async function readChat(credentials: Credentials, chatId: string) {
  const response = await fetch(endpoint(credentials, "readChat"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId,
    }),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `HTTP ${response.status}`);
  }

  return response.json() as Promise<{
    setRead: boolean;
  }>;
}
