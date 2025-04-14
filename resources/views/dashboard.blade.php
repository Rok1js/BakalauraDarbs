<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <form action="{{ url('/admin/generate-posts') }}" method="POST" id="generate-posts-form">
                        @csrf
                        <label for="amount">Number of posts to generate:</label>
                        <input type="number" id="amount" name="amount" min="1" required>
                        <br>
                        <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded-lg">Generate Posts</button>
                    </form>

                    <form method="POST" action="{{ url('/api/send-test-notification') }}">
                        @csrf
                        <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded-lg mt-6">
                            Send Android Notification
                        </button>
                    </form>

                    <form method="POST" action="{{ url('/api/notifications/latest') }}">
                        @csrf
                        <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded-lg mt-6">
                            Send Web Notification
                        </button>
                    </form>

                    <script>
                        document.getElementById('generate-posts-form').addEventListener('submit', function(event) {
                            event.preventDefault();

                            fetch('{{ url('/admin/generate-posts') }}', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                                },
                                body: JSON.stringify({
                                    amount: document.getElementById('amount').value
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    alert(data.message);
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        });
                    </script>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
