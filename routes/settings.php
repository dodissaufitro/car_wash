<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Models\Queue;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('settings/general', function () {
        return Inertia::render('settings/general');
    })->name('settings.general');

    Route::get('settings/account', function () {
        return Inertia::render('settings/account');
    })->name('settings.account');

    Route::get('settings/table-map', function () {
        return Inertia::render('settings/table-map', [
            'queues' => Queue::with(['transaction.customer', 'transaction.vehicle'])
                ->whereIn('status', ['Menunggu', 'Diproses'])
                ->orderBy('nomor_antrian')
                ->get()
                ->map(fn ($q) => [
                    'id' => $q->id,
                    'nomor_antrian' => $q->nomor_antrian,
                    'status' => $q->status,
                    'customer' => $q->transaction?->customer?->nama,
                    'nomor_polisi' => $q->transaction?->vehicle?->nomor_polisi,
                    'merk_kendaraan' => $q->transaction?->vehicle?->merk,
                ]),
        ]);
    })->name('settings.table-map');

    Route::get('settings/delivery', function () {
        return Inertia::render('settings/delivery');
    })->name('settings.delivery');

    Route::get('settings/taxes', function () {
        return Inertia::render('settings/taxes');
    })->name('settings.taxes');

    Route::get('settings/payment', function () {
        return Inertia::render('settings/payment');
    })->name('settings.payment');

    Route::get('settings/notifications', function () {
        return Inertia::render('settings/notifications');
    })->name('settings.notifications');

    Route::get('settings/users', function () {
        return Inertia::render('settings/users');
    })->name('settings.users');

    Route::get('settings/shifts', function () {
        return Inertia::render('settings/shifts');
    })->name('settings.shifts');

    Route::get('settings/services', function () {
        return Inertia::render('settings/services', [
            'services' => Service::with('category')->orderBy('nama_service')->get()->map(fn ($s) => [
                'id' => $s->id,
                'nama_service' => $s->nama_service,
                'harga' => $s->harga,
                'deskripsi' => $s->deskripsi,
                'category_id' => $s->category_id,
                'category_nama' => $s->category?->nama,
                'image' => $s->image,
            ]),
            'categories' => ServiceCategory::orderBy('urutan')->get(['id', 'nama']),
        ]);
    })->name('settings.services');
});
