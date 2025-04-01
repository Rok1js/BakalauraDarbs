<?php

namespace App\Services;

use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use App\Models\PushSubscription;

class PushNotificationService
{
    /**
     * @throws \ErrorException
     */
    public function sendToAll($title, $body)
    {
        $subscriptions = PushSubscription::all();
        $auth = [
            'VAPID' => [
                'subject' => env('VAPID_SUBJECT'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $webPush = new WebPush($auth);

        foreach ($subscriptions as $subscription) {
            // Create proper Subscription object
            $pushSubscription = new Subscription(
                $subscription->endpoint,
                $subscription->public_key,  // Should be p256dh key
                $subscription->auth_token   // Should be auth token
            );

            $webPush->queueNotification(
                $pushSubscription,  // Pass Subscription object here
                json_encode([
                    'title' => $title,
                    'body' => $body,
                    'icon' => '/icon.png'
                ])
            );
        }

        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();

            if ($report->isSuccess()) {
                \Log::info("Notification sent to {$endpoint}");
            } else {
                \Log::error("Notification failed to {$endpoint}: {$report->getReason()}");
                PushSubscription::where('endpoint', $endpoint)->delete();
            }
        }
    }
}