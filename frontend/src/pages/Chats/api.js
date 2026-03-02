import http from '/src/plugins/axios.js';

export async function fetchMessages(roomCode) {
  const { data } = await http.get(`/chats/${roomCode}`);
  return data.messages ?? [];
}

export async function sendMessage(roomCode, payload) {
  const hasFile = !!payload.file;

  if (hasFile) {
    const formData = new FormData();
    formData.append('sender', payload.sender ?? '');
    formData.append('message', payload.message ?? '');
    formData.append('file', payload.file);

    const { data } = await http.post(`/chats/${roomCode}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  }

  const { data } = await http.post(`/chats/${roomCode}/messages`, payload);
  return data;
}

export async function createRoom() {
  const { data } = await http.post('/chats');
  return data;
}

export async function joinRoom(roomCode, sender) {
  const { data } = await http.post(`/chats/${roomCode}/join`, { sender });
  return data;
}

export async function validateRoom(roomCode) {
  try {
    const { data } = await http.get(`/chats/${roomCode}/exists`);
    return !!data?.exists;
  } catch {
    return true;
  }
}
