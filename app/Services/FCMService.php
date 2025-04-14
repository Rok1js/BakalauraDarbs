<?php

namespace App\Services;

use Kreait\Firebase\Factory;

class FCMService
{
    protected $messaging;

    public function __construct()
    {
        $factory = (new Factory)->withServiceAccount(storage_path('app/firebase/firebase_credentials.json'));
        $this->messaging = $factory->createMessaging();
    }

    public function sendNotification(string $token, string $title, string $body): void
    {
        $message = [
            'token' => $token,
            'notification' => [
                'title' => $title,
                'body' => $body,
            ],
        ];

        $this->messaging->send($message);
    }
}