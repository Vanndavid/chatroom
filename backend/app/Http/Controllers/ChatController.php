<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
        $chat->load(['messages' => function ($query) {
            $query->oldest();
        }]);

        return response()->json($chat);
    }

    public function postMessage(Request $request, $code)
    {
        $chat = Chat::where('code', $code)->firstOrFail();

        $validated = $request->validate([
            'sender' => ['nullable', 'string', 'max:80'],
            'message' => ['nullable', 'string', 'max:5000', 'required_without:file'],
            'file' => ['nullable', 'file', 'max:10240', 'required_without:message'],
        ]);

        $payload = [
            'sender' => $validated['sender'] ?? null,
            'message' => isset($validated['message']) ? trim($validated['message']) : null,
        ];

        if ($request->hasFile('file')) {
            $storedPath = $request->file('file')->store('chat_uploads', 'public');
            $payload['attachment_path'] = $storedPath;
            $payload['attachment_name'] = $request->file('file')->getClientOriginalName();
            $payload['attachment_mime'] = $request->file('file')->getClientMimeType();
            $payload['attachment_size'] = $request->file('file')->getSize();
        }

        $message = $chat->messages()->create($payload);

        event(new MessageSent($message, $chat->code));

        return response()->json($message, 201);
    }
}
