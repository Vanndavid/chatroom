<template>
  <v-card flat>
    <v-card-text>
      <v-textarea
        v-model="text"
        label="Type a message…"
        variant="outlined"
        density="comfortable"
        rows="2"
        auto-grow
        max-rows="5"
        hint="Press Enter to send · Shift+Enter for a new line"
        persistent-hint
        :disabled="sending"
        @keydown.enter="onEnter"
      />

      <div class="d-flex justify-end mt-2">
        <v-btn color="primary" :disabled="!text.trim()" :loading="sending" @click="emitSend">
          Send
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['send']);
const props = defineProps({
  sending: { type: Boolean, default: false },
});
const text = ref('');

function onEnter(e) {
  if (e.shiftKey) return;
  e.preventDefault();
  emitSend();
}

function emitSend() {
  if (props.sending) return;
  if (!text.value.trim()) return;
  emit('send', text.value);
  text.value = '';
}
</script>
