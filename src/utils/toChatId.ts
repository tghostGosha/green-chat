import { normalizePhone } from "./normalizePhone";

export function toChatId(phone: string): string {
  return `${normalizePhone(phone)}@c.us`;
}