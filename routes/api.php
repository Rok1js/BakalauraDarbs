<?php

use App\Http\Controllers\PostsController;
use App\Http\Controllers\PushNotificationController;
use Illuminate\Http\Request;
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
Route::get('/notifications/latest', function () {
    return response()->json([
        'title' => '📰 New Post Available!',
        'body' => 'A new article just dropped — check it out now!',
    ]);
});
