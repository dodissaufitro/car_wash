<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Queue;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('payments/index', [
            'payments' => Payment::with(['transaction.customer', 'transaction.vehicle'])
                ->latest()
                ->get()
                ->map(fn ($p) => [
                    'id'           => $p->id,
                    'transaction_id' => $p->transaction_id,
                    'customer'     => $p->transaction?->customer?->nama,
                    'kendaraan'    => $p->transaction?->vehicle?->nomor_polisi,
                    'metode'       => $p->metode,
                    'jumlah_bayar' => $p->jumlah_bayar,
                    'kembalian'    => $p->kembalian,
                    'created_at'   => $p->created_at,
                ]),
            'transactions' => Transaction::with(['customer', 'vehicle'])
                ->where('status', 'Pending')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($t) => [
                    'id'    => $t->id,
                    'label' => '#'.$t->id.' - '.($t->customer?->nama).' ('.($t->vehicle?->nomor_polisi).')',
                    'total' => $t->total,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'transaction_id' => ['required', 'exists:transactions,id'],
            'metode'         => ['required', 'in:Cash,Transfer,QRIS'],
            'jumlah_bayar'   => ['required', 'numeric', 'min:0'],
            'kembalian'      => ['required', 'numeric', 'min:0'],
        ]);

        Payment::create($validated);

        $transaction = Transaction::findOrFail($validated['transaction_id']);
        $transaction->update(['status' => 'Selesai']);
        Queue::where('transaction_id', $transaction->id)->update(['status' => 'Selesai']);

        return back()->with('success', 'Pembayaran berhasil disimpan.');
    }

    public function update(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'transaction_id' => ['required', 'exists:transactions,id'],
            'metode'         => ['required', 'in:Cash,Transfer,QRIS'],
            'jumlah_bayar'   => ['required', 'numeric', 'min:0'],
            'kembalian'      => ['required', 'numeric', 'min:0'],
        ]);

        $payment->update($validated);

        return back()->with('success', 'Pembayaran berhasil diperbarui.');
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return back()->with('success', 'Pembayaran berhasil dihapus.');
    }
}
