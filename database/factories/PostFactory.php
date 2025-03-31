<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        $categories = ['World', 'Local', 'Business', 'Technology', 'Sports', 'Entertainment'];

        $photoLink = $this->generateRandomPhoto();

        return [
            'title'        => $this->faker->sentence,
            'content'      => $this->faker->paragraphs(rand(3, 6), true),
            'category'     => $this->faker->randomElement($categories),
            'published_at' => now()->subDays(rand(1, 30)),
            'photo_link'   => $photoLink,
        ];
    }

    /**
     * @throws \Exception
     */
    protected function generateRandomPhoto()
    {
        $dir = storage_path('app/public/posts');

        // Ensure the directory exists
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        // Use an alternative service (picsum.photos) for a random image
        $url = 'https://picsum.photos/640/480';

        // Fetch the image using Laravel's HTTP client
        $response = Http::get($url);

        if (!$response->successful()) {
            throw new \Exception("Failed to fetch random image from picsum.photos");
        }

        $content = $response->body();

        // Generate a new filename using a random UUID, assuming jpg
        $newFileName = (string) Str::uuid() . '.jpg';

        // Store the image content in the target directory
        file_put_contents($dir . '/' . $newFileName, $content);

        return $newFileName;
    }
}
