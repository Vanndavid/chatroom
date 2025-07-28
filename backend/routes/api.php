<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/chat', function (Request $request) {
    return "hello";
});

Route::post('/chats', [ChatController::class, 'create']);
Route::get('/chats/', [ChatController::class, 'index']);
Route::get('/chats/{code}', [ChatController::class, 'show']);
Route::post('/chats/{code}/messages', [ChatController::class, 'postMessage']);
