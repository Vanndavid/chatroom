<template>
  <v-container class="page py-6 d-flex flex-column" fluid>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="senderName"
          label="Display name"
          variant="outlined"
          density="comfortable"
          @change="store.setSender(senderName?.trim() || store.sender)"
        />
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-chip color="primary" class="ma-2">Room: {{ roomCode }}</v-chip>
        <v-btn
          icon="mdi-content-copy"
          size="small"
          variant="text"
          class="ml-2"
          @click="copyCode"
          :title="`Copy code: ${roomCode}`"
        />
        <v-btn
          icon="mdi-link-variant"
          size="small"
          variant="text"
          @click="copyLink"
          :title="`Copy link: ${fullLink}`"
        />
        <v-btn
          icon="mdi-magnify"
          size="small"
          variant="text"
          class="ml-1"
          @click="openSearchDialog"
          title="Search messages"
        />
      </v-col>
    </v-row>

      <div class="input-box">
        <MessageInput :sending="sending" @send="handleSend" />
      </div>
  </v-container>
</template>

<script setup>
import { computed, inject, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
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
const sending = ref(false);
const snackbar = inject('snackbar');

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];

  return store.messages.filter((m) => {
    const messageText = String(m?.message || '').toLowerCase();
    const senderText = String(m?.sender || '').toLowerCase();
    const fileText = String(m?.attachment_name || '').toLowerCase();
    return messageText.includes(query) || senderText.includes(query) || fileText.includes(query);
  });
});

function toast(msg) {
  if (!snackbar) return;
  snackbar.message = msg;
  snackbar.show = true;
}

const fullLink = `${window.location.origin}/chat/${roomCode}`;

function formatTime(value) {
  const d = new Date(value || Date.now());
  return d.toLocaleTimeString();
}

function openSearchDialog() {
  searchDialog.value = true;
}

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
const scroller = ref(null);

function isNearBottom(el, threshold = 80) {
  return el.scrollHeight - (el.scrollTop + el.clientHeight) <= threshold;
}

async function scrollToBottom(force = false) {
  const el = scroller.value;
  if (!el) return;

  if (force || isNearBottom(el)) {
    await nextTick();
    el.scrollTop = el.scrollHeight;
  }
}

onMounted(async () => {
  scrollToBottom(true);
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
      attachment_name: e.attachment_name,
      attachment_mime: e.attachment_mime,
      attachment_size: e.attachment_size,
      attachment_url: e.attachment_url,
      created_at: e.created_at ?? new Date().toISOString(),
    });
  });
});

watch(
  () => store.messages.length,
  async () => {
    await scrollToBottom(true);
  }
);

onUnmounted(() => leave?.());

async function handleSend(text) {
  if (!text?.trim()) return;
  if (sending.value) return;

  const payload = { sender: store.sender, message: text.trim() };

  try {
    sending.value = true;
    await sendMessage(roomCode, payload);
  } catch (e) {
    toast('Failed to send message.');
  } finally {
    sending.value = false;
  }
}
</script>

<style scoped>
 .page {
   height: calc(100vh - 64px); /* full height minus top app bar (64px) */
 }
 .messages {
   overflow-y: auto;
 }
 .input-box {
   border-top: 1px solid #ddd;
   padding-top: 8px;
 }
</style>
