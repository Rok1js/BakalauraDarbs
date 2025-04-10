<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PostsController extends Controller
{
    public function generatePosts(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:1'
        ]);

        $amount = $request->input('amount');
        Post::factory()->count($amount)->create();

        Cache::flush();

        return response()->json(['message' => "$amount posts generated successfully."], 200);
    }

    public function getPosts()
    {
        $latestPost = Post::orderBy('updated_at', 'desc')->first();
        $version = $latestPost ? $latestPost->updated_at->timestamp : 0;

        $parsed_posts_cache = Cache::rememberForever("parsed_posts_cache-{$version}", function () {
            $posts = Post::orderBy('published_at', 'desc')->get();

            $parsed_posts = [];

            foreach ($posts as $post) {
                $parsed_posts[] = [
                    'id'           => $post->id,
                    'title'        => $post->title,
                    'content'      => $post->content,
                    'category'     => $post->category,
                    'published_at' => $post->published_at,
                    'img_url'      => '/storage/posts/' . $post->photo_link,
                ];
            }

            return $parsed_posts;
        });

        return response()->json($parsed_posts_cache);
    }

    public function getCategoryPosts(string $category)
    {
        $latestCategoryPost = Post::where('category', $category)->orderBy('updated_at', 'desc')->first();
        $version = $latestCategoryPost ? $latestCategoryPost->updated_at->timestamp : 0;

        $parsed_posts_cache = Cache::rememberForever("parsed_posts_cache-{$category}-{$version}", function () use ($category) {
            $posts = Post::where('category', $category)->orderBy('published_at', 'desc')->get();

            $parsed_posts = [];

            foreach ($posts as $post) {
                $parsed_posts[] = [
                    'id'           => $post->id,
                    'title'        => $post->title,
                    'content'      => $post->content,
                    'category'     => $post->category,
                    'published_at' => $post->published_at,
                    'img_url'      => '/storage/posts/' . $post->photo_link,
                ];
            }

            return $parsed_posts;
        });

        return response()->json($parsed_posts_cache);
    }

    public function getPost(string $id)
    {
        $post = Post::findOrFail($id);
        $version = $post->updated_at ? $post->updated_at->timestamp : 0;

        $parsed_post_cache = Cache::rememberForever("parsed_posts_cache-{$id}-{$version}", function () use ($post) {
            return [
                'id'           => $post->id,
                'title'        => $post->title,
                'content'      => $post->content,
                'category'     => $post->category,
                'published_at' => $post->published_at,
                'img_url'      => '/storage/posts/' . $post->photo_link,
            ];
        });

        return response()->json($parsed_post_cache);
    }
}
