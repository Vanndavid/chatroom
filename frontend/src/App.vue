<template>
  <v-app>
    <v-app-bar flat color="primary">
      <v-toolbar-title class="text-white">Vue Chatroom</v-toolbar-title>
      <v-btn icon="mdi-chat" class="text-white" to="/">Chats</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar v-model="snackbar.show" :timeout="4000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { reactive, provide } from 'vue';
const snackbar = reactive({ show: false, message: '' });
provide('snackbar', snackbar);
</script>
