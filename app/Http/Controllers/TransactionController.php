<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Queue;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('transactions/index', [
            'transactions' => Transaction::with(['customer', 'vehicle', 'details.service'])
                ->latest()
                ->get()
                ->map(fn ($t) => [
                    'id'       => $t->id,
                    'customer' => $t->customer?->nama,
                    'kendaraan' => ($t->vehicle?->merk ?? '').' - '.($t->vehicle?->nomor_polisi ?? ''),
                    'tanggal'  => $t->tanggal,
                    'total'    => $t->total,
                    'status'   => $t->status,
                    'details'  => $t->details->map(fn ($d) => [
                        'id'         => $d->id,
                        'service_id' => $d->service_id,
                        'service'    => $d->service?->nama_service,
                        'qty'        => $d->qty,
                        'harga'      => $d->harga,
                        'subtotal'   => $d->subtotal,
                    ]),
                ]),
            'customers' => Customer::orderBy('nama')->get(['id', 'nama']),
            'vehicles'  => Vehicle::with('customer')->get()->map(fn ($v) => [
                'id'          => $v->id,
                'customer_id' => $v->customer_id,
                'label'       => $v->merk.' - '.$v->nomor_polisi,
            ]),
            'services'  => Service::orderBy('nama_service')->get(['id', 'nama_service', 'harga']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $isNewCustomer = $request->input('customer_id') === '__new__';
        $isNewVehicle  = $request->input('vehicle_id') === '__new__';

        $rules = [
            'tanggal' => ['required', 'date'],
            'status'  => ['required', 'in:Pending,Selesai,Batal'],
            'details' => ['required', 'array', 'min:1'],
            'details.*.service_id' => ['required', 'exists:services,id'],
            'details.*.qty'        => ['required', 'integer', 'min:1'],
            'details.*.harga'      => ['required', 'numeric', 'min:0'],
            'add_to_queue' => ['sometimes', 'boolean'],
        ];

        if ($isNewCustomer) {
            $rules['new_customer.nama']   = ['required', 'string', 'max:255'];
            $rules['new_customer.no_hp']  = ['nullable', 'string', 'max:20'];
            $rules['new_customer.alamat'] = ['nullable', 'string', 'max:500'];
        } else {
            $rules['customer_id'] = ['required', 'exists:customers,id'];
        }

        if ($isNewVehicle) {
            $rules['new_vehicle.jenis_kendaraan'] = ['required', 'string', 'in:Motor,Mobil'];
            $rules['new_vehicle.merk']            = ['nullable', 'string', 'max:100'];
            $rules['new_vehicle.nomor_polisi']    = ['required', 'string', 'max:20', 'unique:vehicles,nomor_polisi'];
        } else {
            $rules['vehicle_id'] = ['required', 'exists:vehicles,id'];
        }

        $validated = $request->validate($rules);

        DB::transaction(function () use ($validated, $isNewCustomer, $isNewVehicle, $request) {
            // Buat pelanggan baru jika diperlukan
            if ($isNewCustomer) {
                $customer = Customer::create([
                    'nama'   => $validated['new_customer']['nama'],
                    'no_hp'  => $validated['new_customer']['no_hp'] ?? null,
                    'alamat' => $validated['new_customer']['alamat'] ?? null,
                ]);
                $customerId = $customer->id;
            } else {
                $customerId = $validated['customer_id'];
            }

            // Buat kendaraan baru jika diperlukan
            if ($isNewVehicle) {
                $vehicle = Vehicle::create([
                    'customer_id'      => $customerId,
                    'jenis_kendaraan'  => $validated['new_vehicle']['jenis_kendaraan'],
                    'merk'             => $validated['new_vehicle']['merk'] ?? null,
                    'nomor_polisi'     => $validated['new_vehicle']['nomor_polisi'],
                ]);
                $vehicleId = $vehicle->id;
            } else {
                $vehicleId = $validated['vehicle_id'];
            }

            $total = collect($validated['details'])->sum(fn ($d) => $d['qty'] * $d['harga']);

            $transaction = Transaction::create([
                'customer_id' => $customerId,
                'vehicle_id'  => $vehicleId,
                'tanggal'     => $validated['tanggal'],
                'status'      => $validated['status'],
                'total'       => $total,
            ]);

            foreach ($validated['details'] as $d) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'service_id'     => $d['service_id'],
                    'qty'            => $d['qty'],
                    'harga'          => $d['harga'],
                    'subtotal'       => $d['qty'] * $d['harga'],
                ]);
            }

            // Tambah ke antrian jika diminta
            if ($request->boolean('add_to_queue')) {
                $nextNumber = Queue::max('nomor_antrian') + 1;
                Queue::create([
                    'transaction_id' => $transaction->id,
                    'nomor_antrian'  => $nextNumber,
                    'status'         => 'Menunggu',
                ]);
            }
        });

        return back()->with('success', 'Transaksi berhasil dibuat.');
    }

    public function update(Request $request, Transaction $transaction): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'vehicle_id'  => ['required', 'exists:vehicles,id'],
            'tanggal'     => ['required', 'date'],
            'status'      => ['required', 'in:Pending,Selesai,Batal'],
            'details'     => ['required', 'array', 'min:1'],
            'details.*.service_id' => ['required', 'exists:services,id'],
            'details.*.qty'        => ['required', 'integer', 'min:1'],
            'details.*.harga'      => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $transaction) {
            $total = collect($validated['details'])->sum(fn ($d) => $d['qty'] * $d['harga']);

            $transaction->update([
                'customer_id' => $validated['customer_id'],
                'vehicle_id'  => $validated['vehicle_id'],
                'tanggal'     => $validated['tanggal'],
                'status'      => $validated['status'],
                'total'       => $total,
            ]);

            $transaction->details()->delete();

            foreach ($validated['details'] as $d) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'service_id'     => $d['service_id'],
                    'qty'            => $d['qty'],
                    'harga'          => $d['harga'],
                    'subtotal'       => $d['qty'] * $d['harga'],
                ]);
            }
        });

        return back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $transaction->delete();

        return back()->with('success', 'Transaksi berhasil dihapus.');
    }
}
