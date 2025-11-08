import echo from '/src/plugins/echo.js';

export function joinChat(roomCode, onMessage) {
  const name = `chatroom.${roomCode}`;
  const channel = echo.channel(name).listen('.MessageSent', onMessage);
  return () => echo.leaveChannel(name);
}
