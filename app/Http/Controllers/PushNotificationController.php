<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use App\Services\PushNotificationService;
use Illuminate\Http\Request;

class PushNotificationController extends Controller
{
    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'endpoint' => 'required|url',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string'
        ]);

        PushSubscription::updateOrCreate(
            ['endpoint' => $data['endpoint']],
            [
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth']
            ]
        );

        return response()->json(['status' => 'success']);
    }

    public function unsubscribe(Request $request)
    {
        $data = $request->validate([
            'endpoint' => 'required|url'
        ]);

        $deleted = PushSubscription::where('endpoint', $data['endpoint'])->delete();

        return response()->json([
            'status' => $deleted ? 'success' : 'not_found',
            'deleted' => $deleted
        ]);
    }

    public function sendSampleNotification(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'body' => 'required|string'
        ]);

        try {
            $service = new PushNotificationService();
            $service->sendToAll($request->title, $request->body);
            return response()->json(['status' => 'Notification sent']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}