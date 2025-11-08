<template>
  <v-list-item class="text-left">
    <v-list-item-title class="font-weight-medium">
      {{ msg.sender }}
    </v-list-item-title>

    <v-list-item-subtitle class="text-body-1">
      {{ msg.message }}
    </v-list-item-subtitle>

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
</script>
