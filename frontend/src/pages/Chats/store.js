import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    sender: localStorage.getItem('chat_sender') || `Guest${Math.floor(Math.random() * 1000)}`,
    loading: false,
  }),

  actions: {
    setMessages(list) {
      this.messages = list;
    },
    pushMessage(msg) {
      this.messages.push(msg);
    },
    setLoading(v) {
      this.loading = v;
    },
    setSender(name) {
      this.sender = name;
      localStorage.setItem('chat_sender', name); // ✅ persist name
    },
    clear() {
      this.messages = [];
    },
  },
});
