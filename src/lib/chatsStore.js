import { create } from "zustand";

export const useChatsStore = create((set) => ({
  chats: [],
  setChats: async (chats) => {
    set({ chats: chats });
  },
}));
