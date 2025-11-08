import { createRouter, createWebHistory } from 'vue-router';

const ChatPage = () => import('.././pages/Chats/index.vue');
const Home = () => import('.././pages/Home.vue');
const routes = [
//   { path: '/', redirect: '/chat/PQYANH' },
  { path: '/', name: 'home', component: Home },
  { path: '/chat/:roomCode', name: 'chat-room', component: ChatPage, props: true },
];

export default createRouter({
  history: createWebHistory(),
  routes,                                                                                                               
});
