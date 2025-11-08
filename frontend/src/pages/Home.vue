<!-- src/pages/home.vue -->
<template>
  <v-container class="py-10" fluid>
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-h4 mb-2">Welcome to the Chatroom</h1>
        <div class="text-medium-emphasis">Create a new room or join with a code.</div>
      </v-col>
    </v-row>

    <v-row justify="center" align="stretch" class="gap-6">
      <!-- Create card -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2 hover:elevation-8 transition-ease-in-out" @click="handleCreate" :disabled="loadingCreate">
          <v-card-item>
            <v-icon size="48" class="mb-2">mdi-plus-circle-outline</v-icon>
            <div class="text-h6">Create a Room</div>
            <div class="text-medium-emphasis mt-1">Instantly create and jump in</div>
          </v-card-item>
          <v-card-actions class="justify-center pb-6">
            <v-btn color="primary" :loading="loadingCreate">Create & Go</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Join card -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="elevation-2 hover:elevation-8 transition-ease-in-out" @click="joinDialog = true">
          <v-card-item>
            <v-icon size="48" class="mb-2">mdi-login-variant</v-icon>
            <div class="text-h6">Join a Room</div>
            <div class="text-medium-emphasis mt-1">Enter a code to join</div>
          </v-card-item>
          <v-card-actions class="justify-center pb-6">
            <v-btn variant="tonal">Join</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Join dialog -->
    <v-dialog v-model="joinDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Join a Room</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="roomCode"
            label="Room code"
            variant="outlined"
            autofocus
            @keyup.enter="handleJoin"
          />
          <v-text-field
            v-model="sender"
            label="Your display name"
            variant="outlined"
            @keyup.enter="handleJoin"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="joinDialog = false">Cancel</v-btn>
          <v-btn color="primary" :loading="loadingJoin" @click="handleJoin">Join</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore } from './Chats/store';
import { createRoom, joinRoom, validateRoom } from './Chats/api';

const router = useRouter();
const snackbar = inject('snackbar');
const store = useChatStore();

const joinDialog = ref(false);
const roomCode = ref('');
const sender = ref(store.sender);
const loadingCreate = ref(false);
const loadingJoin = ref(false);

function toast(msg){ if (snackbar){ snackbar.message = msg; snackbar.show = true; } }

async function handleCreate() {
  try {
    loadingCreate.value = true;
    const room = await createRoom(); // adjust payload if your API needs a name
    console.log(room);
    if (!room) throw new Error('No room code returned');
    await router.push(`/chat/${room.code}`);
  } catch (e) {
    console.error(e);
    toast('Failed to create room.',e);
  } finally {
    loadingCreate.value = false;
  }
}

async function handleJoin() {
  const code = roomCode.value?.trim();
  if (!code) return toast('Enter a room code.');

  try {
    loadingJoin.value = true;

    // Optional validation if your backend supports it
    const ok = await validateRoom(code);
    if (ok === false) return toast('Room not found.');

    // Persist the sender locally and optionally register on server
    store.setSender(sender.value?.trim() || store.sender);
    try { await joinRoom(code, store.sender); } catch { /* server join is optional */ }

    joinDialog.value = false;
    await router.push(`/chat/${code}`);
  } catch (e) {
    toast('Failed to join room.');
  } finally {
    loadingJoin.value = false;
  }
}
</script>

<style scoped>
.hover\:elevation-8:hover { box-shadow: var(--v-shadow-8); }
.transition-ease-in-out { transition: box-shadow .2s ease-in-out, transform .2s ease-in-out; }
</style>
