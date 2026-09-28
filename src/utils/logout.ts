import type { Dispatch, SetStateAction } from "react";
import type { Credentials } from "../types";
import { clearCredentials } from "../lib/storage";

type LogoutParams = {
  setCredentials: Dispatch<SetStateAction<Credentials | null>>;
  setConnected: Dispatch<SetStateAction<boolean>>;
  setActiveId: Dispatch<SetStateAction<string | null>>;
  setDraft: Dispatch<SetStateAction<Credentials>>;
};

const defaultCredentials: Credentials = {
  apiUrl: "https://api.green-api.com",
  idInstance: "",
  apiTokenInstance: "",
};

export function logout({
  setCredentials,
  setConnected,
  setActiveId,
  setDraft,
}: LogoutParams): void {
  clearCredentials();
  setCredentials(null);
  setConnected(false);
  setActiveId(null);
  setDraft(defaultCredentials);
}
