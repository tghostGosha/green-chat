import type { Chat } from "../../types";
export type SidebarProps = {
  chats: Chat[];
  activeId: string | null;
  query: string;
  connected: boolean;
  mobileList: boolean;
  onQuery: (v: string) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onLogout: () => void;
};
export default SidebarProps;
