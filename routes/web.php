<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Manajemen hak akses — hanya admin
    Route::prefix('roles')->name('roles.')->middleware('role:admin')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::put('{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('{role}', [RoleController::class, 'destroy'])->name('destroy');
    });

    // Manajemen pengguna — hanya admin
    Route::prefix('users')->name('users.')->middleware('role:admin')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::put('{user}', [UserController::class, 'update'])->name('update');
        Route::delete('{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // Master Data
    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('index');
        Route::post('/', [CustomerController::class, 'store'])->name('store');
        Route::put('{customer}', [CustomerController::class, 'update'])->name('update');
        Route::delete('{customer}', [CustomerController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('vehicles')->name('vehicles.')->group(function () {
        Route::get('/', [VehicleController::class, 'index'])->name('index');
        Route::post('/', [VehicleController::class, 'store'])->name('store');
        Route::put('{vehicle}', [VehicleController::class, 'update'])->name('update');
        Route::delete('{vehicle}', [VehicleController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('services')->name('services.')->group(function () {
        Route::get('/', [ServiceController::class, 'index'])->name('index');
        Route::post('/', [ServiceController::class, 'store'])->name('store');
        Route::put('{service}', [ServiceController::class, 'update'])->name('update');
        Route::delete('{service}', [ServiceController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('employees')->name('employees.')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::post('/', [EmployeeController::class, 'store'])->name('store');
        Route::put('{employee}', [EmployeeController::class, 'update'])->name('update');
        Route::delete('{employee}', [EmployeeController::class, 'destroy'])->name('destroy');
    });

    // Operasional
    Route::get('penjualan', [PenjualanController::class, 'index'])->name('penjualan.index');
    Route::get('penjualan/create', [PenjualanController::class, 'create'])->name('penjualan.create');
    Route::post('penjualan', [PenjualanController::class, 'store'])->name('penjualan.store');
    Route::get('penjualan/{payment}/edit', [PenjualanController::class, 'edit'])->name('penjualan.edit');
    Route::put('penjualan/{payment}', [PenjualanController::class, 'update'])->name('penjualan.update');
    Route::post('penjualan/{payment}/complete', [PenjualanController::class, 'complete'])->name('penjualan.complete');
    Route::get('penjualan/{payment}/struk', [PenjualanController::class, 'struk'])->name('penjualan.struk');

    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::post('/', [TransactionController::class, 'store'])->name('store');
        Route::put('{transaction}', [TransactionController::class, 'update'])->name('update');
        Route::delete('{transaction}', [TransactionController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('index');
        Route::post('/', [PaymentController::class, 'store'])->name('store');
        Route::put('{payment}', [PaymentController::class, 'update'])->name('update');
        Route::delete('{payment}', [PaymentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('queues')->name('queues.')->group(function () {
        Route::get('/', [QueueController::class, 'index'])->name('index');
        Route::post('/', [QueueController::class, 'store'])->name('store');
        Route::put('{queue}', [QueueController::class, 'update'])->name('update');
        Route::delete('{queue}', [QueueController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
