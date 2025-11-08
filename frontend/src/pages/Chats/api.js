import http from '/src/plugins/axios.js';

export async function fetchMessages(roomCode) {
  const { data } = await http.get(`/chats/${roomCode}`);
  return data.messages ?? [];
}

export async function sendMessage(roomCode, payload) {
  const { data } = await http.post(`/chats/${roomCode}/messages`, payload);
  return data;
}
