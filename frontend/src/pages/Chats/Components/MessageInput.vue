<template>
  <v-card flat>
    <v-card-text>
      <v-text-field
        v-model="text"
        label="Type a message…"
        variant="outlined"
        density="comfortable"
        @keyup.enter="emitSend"
        :append-inner-icon="text ? 'mdi-send' : ''"
        @click:append-inner="emitSend"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['send']);
const text = ref('');

function emitSend() {
  if (!text.value.trim()) return;
  emit('send', text.value);
  text.value = '';
}
</script>
