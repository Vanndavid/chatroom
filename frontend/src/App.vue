<template>
  <div>
    <h1>Vue Chatroom ({{ roomCode }})</h1>
    <ul>
      <li v-for="msg in messages" :key="msg.id">
        <strong>{{ msg.sender }}:</strong> {{ msg.message }}
      </li>
    </ul>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import echo from './echo';

const roomCode = 'PQYANH'; // Replace with dynamic later
const messages = ref([]);
const message = ref('');
const sender = ref('Guest' + Math.floor(Math.random() * 1000));
// Listen for messages
onMounted(() => {
  echo.channel(`chatroom.${roomCode}`)
    .listen('.MessageSent', (e) => {
      console.log(e);
      messages.value.push(e);
    });

  // Load existing messages
  axios.get(`http://chat.localhost/api/chats/${roomCode}`)
    .then(res => {
      messages.value = res.data.messages;
    });
});

// Send message
function sendMessage() {
  axios.post(`http://chat.localhost/api/chats/${roomCode}/messages`, {
    sender: sender.value,
    message: message.value,
  });
  message.value = '';
}
</script>
