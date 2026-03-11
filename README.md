# StealthChat

StealthChat is a real-time room-based chat application built with **Laravel 12**, **Reverb/WebSockets**, **Vue 3**, and **Vuetify**.

It is designed for quick, low-friction conversations:
- Create a room instantly
- Share a room code
- Join and chat in real time

## Architecture

- **Backend:** Laravel API + broadcasting (Reverb)
- **Frontend:** Vue 3 (Vite) + Vuetify UI
- **Web server / proxy:** Nginx
- **Container orchestration:** Docker Compose

## Project Structure

- `backend/` — Laravel application (API, events, models, routes)
- `frontend/` — Vue application (chat UI)
- `docker-compose.dev.yml` — local development stack
- `docker-compose.prod.yml` — production-oriented stack

## Quick Start (Development)

1. Copy environment files and set required values.
2. Start the stack:

```bash
docker compose -f docker-compose.dev.yml up --build
```

3. Open the frontend in your browser (based on your compose port mapping).

## Production Readiness Checklist

Before launch, verify the following:

- Set strong, unique secrets (`APP_KEY`, DB credentials, broadcast keys)
- Use HTTPS and secure cookie/session settings
- Configure CORS to trusted origins only
- Set correct `APP_ENV=production` and disable debug mode
- Ensure queue workers and websocket services are supervised
- Add centralized logging and uptime monitoring
- Back up database and define a recovery procedure

## License

This project is licensed under the MIT License.
