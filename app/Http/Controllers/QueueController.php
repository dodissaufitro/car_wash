<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QueueController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('queues/index', [
            'queues'       => Queue::with(['transaction.customer', 'transaction.vehicle'])
                ->orderBy('nomor_antrian')
                ->get()
                ->map(fn ($q) => [
                    'id'            => $q->id,
                    'nomor_antrian' => $q->nomor_antrian,
                    'status'        => $q->status,
                    'transaction_id' => $q->transaction_id,
                    'customer'      => $q->transaction?->customer?->nama,
                    'kendaraan'     => $q->transaction?->vehicle?->merk.' - '.$q->transaction?->vehicle?->nomor_polisi,
                    'created_at'    => $q->created_at,
                ]),
            'transactions' => Transaction::with(['customer', 'vehicle'])
                ->orderByDesc('id')
                ->get()
                ->map(fn ($t) => [
                    'id'    => $t->id,
                    'label' => '#'.$t->id.' - '.($t->customer?->nama).' ('.($t->vehicle?->nomor_polisi).')',
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'transaction_id' => ['required', 'exists:transactions,id'],
            'nomor_antrian'  => ['required', 'integer', 'min:1'],
            'status'         => ['required', 'in:Menunggu,Diproses,Selesai'],
        ]);

        Queue::create($validated);

        return back()->with('success', 'Antrian berhasil ditambahkan.');
    }

    public function update(Request $request, Queue $queue): RedirectResponse
    {
        $validated = $request->validate([
            'transaction_id' => ['required', 'exists:transactions,id'],
            'nomor_antrian'  => ['required', 'integer', 'min:1'],
            'status'         => ['required', 'in:Menunggu,Diproses,Selesai'],
        ]);

        $queue->update($validated);

        return back()->with('success', 'Antrian berhasil diperbarui.');
    }

    public function destroy(Queue $queue): RedirectResponse
    {
        $queue->delete();

        return back()->with('success', 'Antrian berhasil dihapus.');
    }
}
