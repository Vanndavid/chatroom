import http from '/src/plugins/axios.js';

export async function fetchMessages(roomCode) {
  const { data } = await http.get(`/chats/${roomCode}`);
  return data.messages ?? [];
}

export async function sendMessage(roomCode, payload) {
  const { data } = await http.post(`/chats/${roomCode}/messages`, payload);
  return data;
}

// New for home:
export async function createRoom() {
  const { data } = await http.post('/chats');
  return data; // expect { roomCode, ... }
}

export async function joinRoom(roomCode, sender) {
  // only if your backend tracks members
  const { data } = await http.post(`/chats/${roomCode}/join`, { sender });
  return data;
}

export async function validateRoom(roomCode) {
  try {
    const { data } = await http.get(`/chats/${roomCode}/exists`);
    return !!data?.exists;
  } catch {
    return true; // if you don't have this endpoint, just assume true
  }
}