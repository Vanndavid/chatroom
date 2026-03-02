<template>
  <v-list-item class="text-left">
    <v-list-item-title class="font-weight-medium">
      {{ msg.sender }}
    </v-list-item-title>

    <v-list-item-subtitle v-if="msg.message" class="text-body-1 mb-1">
      {{ msg.message }}
    </v-list-item-subtitle>

    <div v-if="msg.attachment_url" class="attachment">
      <a :href="msg.attachment_url" target="_blank" rel="noopener noreferrer">
        📎 {{ msg.attachment_name || 'Attached file' }}
      </a>
      <small v-if="msg.attachment_size" class="text-disabled ml-2">{{ prettySize(msg.attachment_size) }}</small>
    </div>

    <template #append>
      <small class="text-disabled">{{ time }}</small>
    </template>
  </v-list-item>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ msg: { type: Object, required: true } });

const time = computed(() => {
  const d = new Date(props.msg.created_at || Date.now());
  return d.toLocaleTimeString();
});

function prettySize(bytes = 0) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
</script>

<style scoped>
.attachment a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.attachment a:hover {
  text-decoration: underline;
}
</style>
