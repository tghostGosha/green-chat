import { MessageCircle } from "lucide-react";
import "./AuthScreen.css";
import AuthScreenProps from "./AuthScreenProps";
import type { Credentials } from "../../types";
export function AuthScreen({
  value,
  error,
  onChange,
  onSubmit,
}: AuthScreenProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">
          <MessageCircle size={24} />
        </div>
        <h1>Green Chat</h1>
        {[
          ["idInstance", "idInstance"],
          ["apiTokenInstance", "apiTokenInstance"],
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type={key === "apiTokenInstance" ? "password" : "text"}
              value={value[key as keyof Credentials]}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            />
          </label>
        ))}
        {error && <div className="error">{error}</div>}
        <button className="primary wide" onClick={onSubmit}>
          Подключить
        </button>
      </div>
    </div>
  );
}
