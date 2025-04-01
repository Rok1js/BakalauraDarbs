<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('push_subscriptions', function (Blueprint $table) {
            $table->text('endpoint')->change();  // From string to text
            $table->string('public_key', 255)->change();
            $table->string('auth_token', 255)->change();
        });
    }

    public function down()
    {
        Schema::table('push_subscriptions', function (Blueprint $table) {
            $table->string('endpoint', 512)->change();
            $table->string('public_key', 180)->change();
            $table->string('auth_token', 100)->change();
        });
    }
};
