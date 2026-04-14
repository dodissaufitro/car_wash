<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('customers/index', [
            'customers' => Customer::withCount('vehicles', 'transactions')->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'   => ['required', 'string', 'max:255'],
            'no_hp'  => ['nullable', 'string', 'max:20'],
            'alamat' => ['nullable', 'string'],
        ]);

        Customer::create($validated);

        return back()->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'nama'   => ['required', 'string', 'max:255'],
            'no_hp'  => ['nullable', 'string', 'max:20'],
            'alamat' => ['nullable', 'string'],
        ]);

        $customer->update($validated);

        return back()->with('success', 'Pelanggan berhasil diperbarui.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return back()->with('success', 'Pelanggan berhasil dihapus.');
    }
}
