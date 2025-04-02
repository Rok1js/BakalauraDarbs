<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    public function generatePosts(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:1'
        ]);

        $amount = $request->input('amount');
        Post::factory()->count($amount)->create();

        return response()->json(['message' => "$amount posts generated successfully."], 200);
    }

    public function getPosts()
    {
        $posts = Post::orderBy('published_at', 'desc')->get();

        $parsed_posts = [];

        foreach ($posts as $post) {
            $parsed_posts[] = [
                'id'           => $post->id,
                'title'        => $post->title,
                'content'      => $post->content,
                'category'     => $post->category,
                'published_at' => $post->published_at,
                // Prepend the storage path to the photo_link field:
                'img_url'      => '/storage/posts/' . $post->photo_link,
            ];
        }

        return response()->json($parsed_posts);
    }

    public function getCategoryPosts(string $category)
    {
        $posts = Post::where('category', $category)->orderBy('published_at', 'desc')->get();

        $parsed_posts = [];

        foreach ($posts as $post) {
            $parsed_posts[] = [
                'id'           => $post->id,
                'title'        => $post->title,
                'content'      => $post->content,
                'category'     => $post->category,
                'published_at' => $post->published_at,
                // Prepend the storage path to the photo_link field:
                'img_url'      => '/storage/posts/' . $post->photo_link,
            ];
        }

        return response()->json($parsed_posts);
    }

    public function getPost(string $id)
    {
        $post = Post::find($id);

        $parsed_post = [
            'id'           => $post->id,
            'title'        => $post->title,
            'content'      => $post->content,
            'category'     => $post->category,
            'published_at' => $post->published_at,
            // Prepend the storage path to the photo_link field:
            'img_url'      => '/storage/posts/' . $post->photo_link,
        ];

        return response()->json($parsed_post);
    }
}
