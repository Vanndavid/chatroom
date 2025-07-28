<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Events\MessageSent; 

class ChatController extends Controller
{
    public function index()
    {
        $chats = Chat::get();

        return response()->json($chats, 201);
    }

     public function create(Request $request)
    {
        $chat = Chat::create([
            'code' => strtoupper(Str::random(6)),
            'name' => $request->input('name'),
        ]);

        return response()->json($chat, 201);
    }

    public function show($code)
    {
        $chat = Chat::where('code', $code)->firstOrFail();
        $chat->load('messages');

        return response()->json($chat);
    }

    public function postMessage(Request $request, $code)
    {
        $chat = Chat::where('code', $code)->firstOrFail();

        $message = $chat->messages()->create([
            'sender' => $request->input('sender'),
            'message' => $request->input('message'),
        ]);

        event(new MessageSent($message, $chat->code));
        return response()->json($message, 201);
    }
}
