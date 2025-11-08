import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_ECHO_KEY,                    // e.g. 'local'
  wsHost: import.meta.env.VITE_ECHO_HOST || window.location.hostname,
  wsPort: Number(import.meta.env.VITE_ECHO_PORT || 6001),
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
});

export default echo;
