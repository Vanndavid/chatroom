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

      <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-2">
        <div class="d-flex align-center ga-2">
          <v-btn variant="tonal" prepend-icon="mdi-paperclip" :disabled="sending" @click="pickFile">
            Attach file
          </v-btn>
          <input
            ref="fileInput"
            type="file"
            class="d-none"
            @change="onFileSelected"
          >
          <div v-if="selectedFile" class="text-caption text-medium-emphasis">
            {{ selectedFile.name }} ({{ prettySize(selectedFile.size) }})
            <v-btn size="x-small" variant="text" color="error" @click="clearFile">Remove</v-btn>
          </div>
        </div>

        <v-btn color="primary" :disabled="!canSend" :loading="sending" @click="emitSend">
          Send
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['send']);
const props = defineProps({
  sending: { type: Boolean, default: false },
});

const text = ref('');
const fileInput = ref(null);
const selectedFile = ref(null);

const canSend = computed(() => !!text.value.trim() || !!selectedFile.value);

function onEnter(e) {
  if (e.shiftKey) return;
  e.preventDefault();
  emitSend();
}

function pickFile() {
  fileInput.value?.click();
}

function onFileSelected(e) {
  selectedFile.value = e.target.files?.[0] || null;
}

function clearFile() {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

function prettySize(bytes = 0) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function emitSend() {
  if (props.sending) return;
  if (!canSend.value) return;

  emit('send', {
    message: text.value,
    file: selectedFile.value,
  });

  text.value = '';
  clearFile();
}
</script>
