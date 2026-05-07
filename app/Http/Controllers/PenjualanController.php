<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Payment;
use App\Models\Queue;
use App\Models\ServiceCategory;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PenjualanController extends Controller
{
    public function index(): Response
    {
        $penjualan = Payment::with(['transaction.customer', 'transaction.vehicle', 'transaction.details.service', 'transaction.queue'])
            ->latest()
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'tanggal' => $p->created_at->format('Y-m-d'),
                'customer' => $p->transaction?->customer?->nama,
                'kendaraan' => ($p->transaction?->vehicle?->merk ?? '').' - '.($p->transaction?->vehicle?->nomor_polisi ?? ''),
                'layanan' => $p->transaction?->details->map(fn ($d) => $d->service?->nama_service)->filter()->join(', '),
                'total' => (float) ($p->transaction?->total ?? 0),
                'metode' => $p->metode,
                'jumlah_bayar' => $p->jumlah_bayar !== null ? (float) $p->jumlah_bayar : null,
                'kembalian' => $p->kembalian !== null ? (float) $p->kembalian : null,
                'queue_status' => $p->transaction?->queue?->status ?? 'Selesai',
                'bay_number' => $p->transaction?->queue?->nomor_antrian,
            ]);

        $today = Carbon::today()->format('Y-m-d');

        $stats = [
            'total_pendapatan' => $penjualan->sum('total'),
            'total_transaksi' => $penjualan->count(),
            'pendapatan_hari_ini' => $penjualan->where('tanggal', $today)->sum('total'),
            'transaksi_hari_ini' => $penjualan->where('tanggal', $today)->count(),
            'per_metode' => [
                'Cash' => $penjualan->where('metode', 'Cash')->sum('total'),
                'Transfer' => $penjualan->where('metode', 'Transfer')->sum('total'),
                'QRIS' => $penjualan->where('metode', 'QRIS')->sum('total'),
            ],
        ];

        return Inertia::render('penjualan/index', [
            'penjualan' => $penjualan,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('penjualan/create', [
            'categories' => ServiceCategory::orderBy('urutan')
                ->with(['services' => fn ($q) => $q->orderBy('nama_service')])
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'nama' => $c->nama,
                    'ikon' => $c->ikon,
                    'services' => $c->services->map(fn ($s) => [
                        'id' => $s->id,
                        'nama_service' => $s->nama_service,
                        'harga' => $s->harga,
                        'deskripsi' => $s->deskripsi,
                        'emoji' => $s->emoji,
                        'image' => $s->image,
                    ]),
                ]),
            'customers' => Customer::orderBy('nama')->get(['id', 'nama']),
            'vehicles' => Vehicle::with('customer')->get()->map(fn ($v) => [
                'id' => $v->id,
                'customer_id' => $v->customer_id,
                'label' => $v->merk.' - '.$v->nomor_polisi,
            ]),
            'occupiedBays' => Queue::whereIn('status', ['Menunggu', 'Diproses'])
                ->pluck('nomor_antrian')
                ->toArray(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $isNewCustomer = $request->input('customer_id') === '__new__';
        $isNewVehicle = $request->input('vehicle_id') === '__new__';
        $hasVehicle = $request->filled('vehicle_id') && $request->input('vehicle_id') !== '__none__';

        $rules = [
            'tanggal' => ['required', 'date'],
            'metode' => ['nullable', 'in:Cash,Transfer,QRIS'],
            'jumlah_bayar' => ['nullable', 'numeric', 'min:0'],
            'details' => ['required', 'array', 'min:1'],
            'details.*.service_id' => ['required', 'exists:services,id'],
            'details.*.qty' => ['required', 'integer', 'min:1'],
            'details.*.harga' => ['required', 'numeric', 'min:0'],
            'bay_number' => ['required', 'integer', 'min:1', 'max:6'],
        ];

        if ($isNewCustomer) {
            $rules['new_customer.nama'] = ['required', 'string', 'max:255'];
            $rules['new_customer.no_hp'] = ['nullable', 'string', 'max:20'];
            $rules['new_customer.alamat'] = ['nullable', 'string', 'max:500'];
        } else {
            $rules['customer_id'] = ['required', 'exists:customers,id'];
        }

        if ($isNewVehicle) {
            $rules['new_vehicle.jenis_kendaraan'] = ['required', 'string', 'in:Motor,Mobil'];
            $rules['new_vehicle.merk'] = ['nullable', 'string', 'max:100'];
            $rules['new_vehicle.nomor_polisi'] = ['required', 'string', 'max:20', 'unique:vehicles,nomor_polisi'];
        } elseif ($hasVehicle) {
            $rules['vehicle_id'] = ['required', 'exists:vehicles,id'];
        }

        $validated = $request->validate($rules);

        DB::transaction(function () use ($validated, $isNewCustomer, $isNewVehicle) {
            if ($isNewCustomer) {
                $customer = Customer::create([
                    'nama' => $validated['new_customer']['nama'],
                    'no_hp' => $validated['new_customer']['no_hp'] ?? null,
                    'alamat' => $validated['new_customer']['alamat'] ?? null,
                ]);
                $customerId = $customer->id;
            } else {
                $customerId = $validated['customer_id'];
            }

            if ($isNewVehicle) {
                $vehicle = Vehicle::create([
                    'customer_id' => $customerId,
                    'jenis_kendaraan' => $validated['new_vehicle']['jenis_kendaraan'],
                    'merk' => $validated['new_vehicle']['merk'] ?? null,
                    'nomor_polisi' => $validated['new_vehicle']['nomor_polisi'],
                ]);
                $vehicleId = $vehicle->id;
            } elseif (! empty($validated['vehicle_id'])) {
                $vehicleId = $validated['vehicle_id'];
            } else {
                $vehicleId = null;
            }

            $total = collect($validated['details'])->sum(fn ($d) => $d['qty'] * $d['harga']);

            $transaction = Transaction::create([
                'customer_id' => $customerId,
                'vehicle_id' => $vehicleId,
                'tanggal' => $validated['tanggal'],
                'total' => $total,
                'status' => 'Selesai',
            ]);

            foreach ($validated['details'] as $d) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'service_id' => $d['service_id'],
                    'qty' => $d['qty'],
                    'harga' => $d['harga'],
                    'subtotal' => $d['qty'] * $d['harga'],
                ]);
            }

            $kembalian = (! empty($validated['jumlah_bayar']) && ! empty($validated['metode']))
                ? max(0, $validated['jumlah_bayar'] - $total)
                : null;

            Payment::create([
                'transaction_id' => $transaction->id,
                'metode' => $validated['metode'] ?? null,
                'jumlah_bayar' => ! empty($validated['jumlah_bayar']) ? $validated['jumlah_bayar'] : null,
                'kembalian' => $kembalian,
            ]);

            Queue::create([
                'transaction_id' => $transaction->id,
                'nomor_antrian' => $validated['bay_number'],
                'status' => 'Menunggu',
            ]);
        });

        return redirect()->route('penjualan.index')->with('success', 'Penjualan berhasil dicatat.');
    }

    public function edit(Payment $payment): Response
    {
        $transaction = $payment->load([
            'transaction.customer',
            'transaction.vehicle',
            'transaction.details.service',
            'transaction.queue',
        ])->transaction;

        return Inertia::render('penjualan/edit', [
            'payment' => [
                'id' => $payment->id,
                'metode' => $payment->metode,
                'jumlah_bayar' => $payment->jumlah_bayar,
            ],
            'transaction' => [
                'id' => $transaction->id,
                'customer_id' => $transaction->customer_id,
                'vehicle_id' => $transaction->vehicle_id,
                'tanggal' => $transaction->tanggal instanceof Carbon
                    ? $transaction->tanggal->format('Y-m-d')
                    : substr($transaction->tanggal, 0, 10),
                'details' => $transaction->details->map(fn ($d) => [
                    'service_id' => $d->service_id,
                    'nama_service' => $d->service?->nama_service,
                    'harga' => $d->harga,
                    'qty' => $d->qty,
                ])->values(),
            ],
            'queue' => $transaction->queue ? [
                'id' => $transaction->queue->id,
                'bay_number' => $transaction->queue->nomor_antrian,
                'status' => $transaction->queue->status,
            ] : null,
            'categories' => ServiceCategory::orderBy('urutan')
                ->with(['services' => fn ($q) => $q->orderBy('nama_service')])
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'nama' => $c->nama,
                    'ikon' => $c->ikon,
                    'services' => $c->services->map(fn ($s) => [
                        'id' => $s->id,
                        'nama_service' => $s->nama_service,
                        'harga' => $s->harga,
                        'deskripsi' => $s->deskripsi,
                        'emoji' => $s->emoji,
                        'image' => $s->image,
                    ]),
                ]),
            'customers' => Customer::orderBy('nama')->get(['id', 'nama']),
            'vehicles' => Vehicle::with('customer')->get()->map(fn ($v) => [
                'id' => $v->id,
                'customer_id' => $v->customer_id,
                'label' => $v->merk.' - '.$v->nomor_polisi,
            ]),
            'occupiedBays' => Queue::whereIn('status', ['Menunggu', 'Diproses'])
                ->where('transaction_id', '!=', $transaction->id)
                ->pluck('nomor_antrian')
                ->toArray(),
        ]);
    }

    public function update(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'vehicle_id' => ['nullable', 'exists:vehicles,id'],
            'tanggal' => ['required', 'date'],
            'metode' => ['required', 'in:Cash,Transfer,QRIS'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
            'details' => ['required', 'array', 'min:1'],
            'details.*.service_id' => ['required', 'exists:services,id'],
            'details.*.qty' => ['required', 'integer', 'min:1'],
            'details.*.harga' => ['required', 'numeric', 'min:0'],
            'bay_number' => ['required', 'integer', 'min:1', 'max:6'],
            'queue_status' => ['required', 'in:Menunggu,Diproses,Selesai'],
        ]);

        DB::transaction(function () use ($validated, $payment) {
            $transaction = $payment->transaction;

            $total = collect($validated['details'])->sum(fn ($d) => $d['qty'] * $d['harga']);

            $transaction->update([
                'customer_id' => $validated['customer_id'],
                'vehicle_id' => $validated['vehicle_id'] ?? null,
                'tanggal' => $validated['tanggal'],
                'total' => $total,
            ]);

            $transaction->details()->delete();
            foreach ($validated['details'] as $d) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'service_id' => $d['service_id'],
                    'qty' => $d['qty'],
                    'harga' => $d['harga'],
                    'subtotal' => $d['qty'] * $d['harga'],
                ]);
            }

            $kembalian = max(0, $validated['jumlah_bayar'] - $total);
            $payment->update([
                'metode' => $validated['metode'],
                'jumlah_bayar' => $validated['jumlah_bayar'],
                'kembalian' => $kembalian,
            ]);

            $queue = $transaction->queue;
            if ($queue) {
                $queue->update([
                    'nomor_antrian' => $validated['bay_number'],
                    'status' => $validated['queue_status'],
                ]);
            } else {
                Queue::create([
                    'transaction_id' => $transaction->id,
                    'nomor_antrian' => $validated['bay_number'],
                    'status' => $validated['queue_status'],
                ]);
            }
        });

        return redirect()->route('penjualan.index')->with('success', 'Penjualan berhasil diperbarui.');
    }

    public function complete(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'metode' => ['required', 'in:Cash,Transfer,QRIS'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $payment) {
            $total = $payment->transaction->total ?? 0;
            $kembalian = max(0, $validated['jumlah_bayar'] - $total);

            $payment->update([
                'metode' => $validated['metode'],
                'jumlah_bayar' => $validated['jumlah_bayar'],
                'kembalian' => $kembalian,
            ]);

            if ($payment->transaction->queue) {
                $payment->transaction->queue->update(['status' => 'Selesai']);
            }

            $payment->transaction->update(['status' => 'Selesai']);
        });

        return redirect()->route('penjualan.struk', $payment->id)->with('success', 'Pesanan berhasil diselesaikan.');
    }

    public function struk(Payment $payment): Response
    {
        $payment->load(['transaction.customer', 'transaction.vehicle', 'transaction.details.service', 'transaction.queue']);
        $transaction = $payment->transaction;

        return Inertia::render('penjualan/struk', [
            'struk' => [
                'payment_id' => $payment->id,
                'tanggal' => $transaction->tanggal instanceof Carbon
                    ? $transaction->tanggal->format('Y-m-d H:i')
                    : substr($transaction->tanggal, 0, 16),
                'customer' => $transaction->customer?->nama,
                'no_hp' => $transaction->customer?->no_hp,
                'kendaraan' => $transaction->vehicle
                    ? ($transaction->vehicle->merk.' - '.$transaction->vehicle->nomor_polisi)
                    : null,
                'jenis_kendaraan' => $transaction->vehicle?->jenis_kendaraan,
                'bay_number' => $transaction->queue?->nomor_antrian,
                'items' => $transaction->details->map(fn ($d) => [
                    'nama_service' => $d->service?->nama_service,
                    'qty' => $d->qty,
                    'harga' => $d->harga,
                    'subtotal' => $d->subtotal,
                ])->values(),
                'total' => $transaction->total,
                'metode' => $payment->metode,
                'jumlah_bayar' => $payment->jumlah_bayar,
                'kembalian' => $payment->kembalian,
            ],
        ]);
    }
}
