import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthScreen } from "../components";
import { loadCredentials, saveCredentials } from "../lib/storage";
import type { Credentials } from "../types";

const defaultCredentials: Credentials = {
  apiUrl: "https://api.green-api.com",
  idInstance: "",
  apiTokenInstance: "",
};

export function LoginPage() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<Credentials>(
    loadCredentials() || defaultCredentials,
  );

  const [error, setError] = useState("");

  const handleSave = () => {
    if (
      !credentials.idInstance.trim() ||
      !credentials.apiTokenInstance.trim()
    ) {
      setError("Укажите idInstance и apiTokenInstance.");

      return;
    }

    saveCredentials(credentials);

    setError("");

    navigate("/chat", {
      replace: true,
    });
  };

  return (
    <AuthScreen
      value={credentials}
      error={error}
      onChange={setCredentials}
      onSubmit={handleSave}
    />
  );
}
