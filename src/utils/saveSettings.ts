import type { Dispatch, SetStateAction } from "react";
import type { Credentials } from "../types";
import { saveCredentials } from "../lib/storage";

type SaveSettingsParams = {
  credentials: Credentials;
  setCredentials: Dispatch<SetStateAction<Credentials | null>>;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
};

export function saveSettings({
  credentials,
  setCredentials,
  setShowSettings,
  setError,
}: SaveSettingsParams): void {
  if (
    !credentials.idInstance.trim() ||
    !credentials.apiTokenInstance.trim()
  ) {
    setError("Укажите idInstance и apiTokenInstance.");
    return;
  }
  saveCredentials(credentials);
  setCredentials(credentials);
  setShowSettings(false);
  setError("");
}