<template>
  <v-card flat>
    <v-card-text class="pa-0">
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

  if (force || isNearBottom(el)) {
    await nextTick();
    el.scrollTop = el.scrollHeight;
  }
}

onMounted(() => {
  scrollToBottom(true);
});

watch(
  () => props.messages.length,
  async () => {
    await scrollToBottom(true);
  }
);
</script>

<style scoped>
.messages-scroll {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>
