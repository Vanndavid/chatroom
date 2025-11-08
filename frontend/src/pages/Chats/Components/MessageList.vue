<template>
  <v-card flat>
    <v-card-text class="pa-0">
      <!-- Put the scrollable area on a plain div (easier ref than a Vuetify component) -->
      <div ref="scroller" class="messages-scroll">
        <v-skeleton-loader
          v-if="loading"
          type="list-item-two-line"
          class="mb-2"
          v-for="n in 6"
          :key="n"
        />
        <template v-else>
          <div v-if="!messages?.length" class="text-medium-emphasis pa-4">
            No messages yet — say hi 👋
          </div>
          <v-list v-else density="comfortable">
            <MessageItem v-for="m in messages" :key="m.id" :msg="m" />
          </v-list>
        </template>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import MessageItem from './MessageItem.vue';

const props = defineProps({
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const scroller = ref(null);

function isNearBottom(el, threshold = 80) {
  return el.scrollHeight - (el.scrollTop + el.clientHeight) <= threshold;
}

async function scrollToBottom(force = false) {
  const el = scroller.value;
  if (!el) return;

  // Only pin to bottom if user is already near bottom, unless force = true
  if (force || isNearBottom(el)) {
    await nextTick();
    el.scrollTop = el.scrollHeight;
  }
}

onMounted(() => {
  // Initial scroll (force on first render)
  scrollToBottom(true);
});

// When messages change, try to keep pinned to bottom
watch(
  () => props.messages.length,
  async () => {
    await scrollToBottom(false);
  }
);
</script>

<style scoped>
.messages-scroll {
  height: 60vh;
  overflow-y: auto;
  /* smooth if you like */
  scroll-behavior: smooth;
}
</style>
