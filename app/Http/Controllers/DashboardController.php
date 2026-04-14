<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Employee;
use App\Models\Queue;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\Vehicle;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = today();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalPelanggan'    => Customer::count(),
                'totalKendaraan'    => Vehicle::count(),
                'totalLayanan'      => Service::count(),
                'totalKaryawan'     => Employee::count(),
                'transaksiHariIni'  => Transaction::whereDate('tanggal', $today)->count(),
                'pendapatanHariIni' => Transaction::whereDate('tanggal', $today)
                    ->where('status', 'Selesai')
                    ->sum('total'),
                'antrianAktif'      => Queue::whereIn('status', ['Menunggu', 'Diproses'])->count(),
                'totalTransaksi'    => Transaction::count(),
            ],
            'recentTransactions' => Transaction::with(['customer', 'vehicle'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($t) => [
                    'id'          => $t->id,
                    'customer'    => $t->customer?->nama,
                    'kendaraan'   => $t->vehicle?->merk.' - '.$t->vehicle?->nomor_polisi,
                    'total'       => $t->total,
                    'status'      => $t->status,
                    'tanggal'     => $t->tanggal,
                ]),
            'activeQueues' => Queue::with(['transaction.customer', 'transaction.vehicle'])
                ->whereIn('status', ['Menunggu', 'Diproses'])
                ->orderBy('nomor_antrian')
                ->limit(6)
                ->get()
                ->map(fn ($q) => [
                    'id'             => $q->id,
                    'nomor_antrian'  => $q->nomor_antrian,
                    'status'         => $q->status,
                    'customer'       => $q->transaction?->customer?->nama,
                    'kendaraan'      => $q->transaction?->vehicle?->merk.' - '.$q->transaction?->vehicle?->nomor_polisi,
                ]),
        ]);
    }
}
