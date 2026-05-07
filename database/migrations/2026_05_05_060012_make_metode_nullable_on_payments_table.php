<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('metode', ['Cash', 'Transfer', 'QRIS'])->nullable()->default(null)->change();
            $table->decimal('jumlah_bayar', 10, 2)->nullable()->default(null)->change();
            $table->decimal('kembalian', 10, 2)->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('metode', ['Cash', 'Transfer', 'QRIS'])->nullable(false)->change();
            $table->decimal('jumlah_bayar', 10, 2)->nullable(false)->change();
            $table->decimal('kembalian', 10, 2)->default(0)->nullable(false)->change();
        });
    }
};
