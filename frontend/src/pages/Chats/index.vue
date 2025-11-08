<template>
  <v-container class="py-6" max-width="1200">
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="senderName"
          label="Display name"
          variant="outlined"
          density="comfortable"
          @change="store.setSender(senderName)"
        />
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        
        <v-chip color="primary" class="ma-2">Room: {{ roomCode }}</v-chip>
           <!-- Copy code button -->
        <v-btn
        icon="mdi-content-copy"
        size="small"
        variant="text"
        class="ml-2"
        @click="copyCode"
        :title="`Copy code: ${roomCode}`"
        />

        <!-- Copy full link button -->
        <v-btn
        icon="mdi-link-variant"
        size="small"
        variant="text"
        @click="copyLink"
        :title="`Copy link: ${fullLink}`"
        />
      </v-col>
    </v-row>
    <MessageList :messages="store.messages" :loading="store.loading" />
    <MessageInput class="mt-4" @send="handleSend" />
  </v-container>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from './store';
import { fetchMessages, sendMessage } from './api';
import { joinChat } from './sockets';
import MessageList from './Components/MessageList.vue';
import MessageInput from './Components/MessageInput.vue';

const route = useRoute();
const roomCode = route.params.roomCode;
const store = useChatStore();
const senderName = ref(store.sender);
const snackbar = inject('snackbar');

function toast(msg) {
  if (!snackbar) return;
  snackbar.message = msg;
  snackbar.show = true;
}
const fullLink = `${window.location.origin}/chat/${roomCode}`;

function copyCode() {
  navigator.clipboard.writeText(roomCode)
    .then(() => toast(`Copied code: ${roomCode}`))
    .catch(() => toast('Failed to copy code'));
}

function copyLink() {
  navigator.clipboard.writeText(fullLink)
    .then(() => toast(`Copied link:\n${fullLink}`))
    .catch(() => toast('Failed to copy link'));
}

let leave;
onMounted(async () => {
  try {
    store.setLoading(true);
    store.setMessages(await fetchMessages(roomCode));
  } catch (e) {
    toast('Failed to load messages.');
  } finally {
    store.setLoading(false);
  }

  leave = joinChat(roomCode, (e) => {
    store.pushMessage({
      id: e.id ?? crypto.randomUUID?.() ?? Date.now(),
      sender: e.sender,
      message: e.message,
      created_at: e.created_at ?? new Date().toISOString(),
    });
  });
});

onUnmounted(() => leave?.());

async function handleSend(text) {
  if (!text?.trim()) return;
  const payload = { sender: store.sender, message: text.trim() };

  // Optimistic insert
//   store.pushMessage({ id: `temp-${Date.now()}`, ...payload, created_at: new Date().toISOString() });

  try {
    await sendMessage(roomCode, payload);
  } catch (e) {
    toast('Failed to send message.');
  }
}
</script>
