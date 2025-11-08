import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    sender: `Guest${Math.floor(Math.random() * 1000)}`,
    loading: false,
  }),
  actions: {
    setMessages(list) { this.messages = list; },
    pushMessage(msg) { this.messages.push(msg); },
    setLoading(v) { this.loading = v; },
    setSender(name) { this.sender = name; },
    clear() { this.messages = []; },
  },
});
