<?php

use App\Http\Controllers\PostsController;
use App\Http\Controllers\PushNotificationController;
use App\Services\FCMService;
use App\Services\PushNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::get('/posts', [PostsController::class, 'getPosts']);
Route::get('/post/{id}', [PostsController::class, 'getPost']);
Route::get('/posts/{category}', [PostsController::class, 'getCategoryPosts']);
Route::post('/subscribe', [PushNotificationController::class, 'subscribe'])->middleware('throttle:10,1');
Route::post('/send-notification', [PushNotificationController::class, 'sendSampleNotification']);
Route::post('/unsubscribe', [PushNotificationController::class, 'unsubscribe']);
Route::post('/notifications/latest', function () {
    $service = new PushNotificationService();
    $service->sendToAll("🚀 Testa paziņojums", 'PWA lietotnes testa paziņojums!');

    return back()->with('success', 'Notification sent to all tokens!');
});

Route::post('/send-test-notification', function (FCMService $fcm) {
    $tokens = DB::table('fcm_tokens')->pluck('token')->toArray();

    foreach ($tokens as $token) {
        try {
            $fcm->sendNotification(
                $token,
                '🚀 Testa paziņojums',
                'Flutter lietotnes testa paziņojums!'
            );
        } catch (\Throwable $e) {
            \Log::warning("FCM failed for $token: " . $e->getMessage());
        }
    }

    return back()->with('success', 'Notification sent to all tokens!');
});

Route::post('/fcm-token', function (Request $request) {
    $request->validate(['token' => 'required']);

    // You can store it in DB, e.g., `fcm_tokens` table
    DB::table('fcm_tokens')->updateOrInsert(
        ['token' => $request->token],
        ['updated_at' => now()]
    );

    return response()->json(['success' => true]);
});
