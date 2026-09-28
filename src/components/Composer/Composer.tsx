import { Paperclip, Send, Smile } from "lucide-react";
import "./Composer.css";
export function Composer({
  value,
  onChange,
  onSend,
  onKeyDown,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <footer className="composer">
      <button className="icon-btn">
        <Paperclip />
      </button>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Напишите сообщение..."
        rows={1}
      />
      <button className="icon-btn">
        <Smile />
      </button>
      <button className="send-btn" disabled={!value.trim()} onClick={onSend}>
        <Send size={19} />
      </button>
    </footer>
  );
}
