import "./NewChatModal.css";
export function NewChatModal({
  phone,
  setPhone,
  error,
  onClose,
  onCreate,
}: {
  phone: string;
  setPhone: (v: string) => void;
  error: string;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Новый чат</h3>
          <button className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <p>Введите номер получателя в международном формате.</p>
        <input
          autoFocus
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCreate()}
          placeholder="+79991234567"
        />
        {error && <div className="error">{error}</div>}
        <button className="primary wide" onClick={onCreate}>
          Создать чат
        </button>
      </div>
    </div>
  );
}
