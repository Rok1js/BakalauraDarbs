<?php

namespace App\Console\Commands;

use App\Services\PushNotificationService;
use Illuminate\Console\Command;

class SendNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:send {title} {body}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     * @throws \ErrorException
     */
    public function handle()
    {
        $service = new PushNotificationService();
        $service->sendToAll($this->argument('title'), $this->argument('body'));
        $this->info('Notification sent!');
    }
}
