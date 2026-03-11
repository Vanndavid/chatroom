# StealthChat Backend

Laravel 12 backend API for StealthChat.

## Responsibilities

- Room creation and validation
- Joining chat rooms
- Message persistence
- Real-time message broadcasting

## Requirements

- PHP 8.2+
- Composer
- Database (configured via `.env`)

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

## Local Development

```bash
php artisan serve
```

Run tests:

```bash
php artisan test
```
