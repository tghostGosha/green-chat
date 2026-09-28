import type { KeyboardEvent } from "react";

type HandleKeyDownParams = {
  event: KeyboardEvent<HTMLTextAreaElement>;
  onSend: () => void;
};

export function handleKeyDown({ event, onSend }: HandleKeyDownParams): void {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    onSend();
  }
}
