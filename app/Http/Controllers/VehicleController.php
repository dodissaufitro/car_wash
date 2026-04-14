<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('vehicles/index', [
            'vehicles'  => Vehicle::with('customer')->latest()->get(),
            'customers' => Customer::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id'      => ['required', 'exists:customers,id'],
            'jenis_kendaraan'  => ['required', 'in:Motor,Mobil'],
            'merk'             => ['nullable', 'string', 'max:100'],
            'nomor_polisi'     => ['required', 'string', 'max:20'],
        ]);

        Vehicle::create($validated);

        return back()->with('success', 'Kendaraan berhasil ditambahkan.');
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id'      => ['required', 'exists:customers,id'],
            'jenis_kendaraan'  => ['required', 'in:Motor,Mobil'],
            'merk'             => ['nullable', 'string', 'max:100'],
            'nomor_polisi'     => ['required', 'string', 'max:20'],
        ]);

        $vehicle->update($validated);

        return back()->with('success', 'Kendaraan berhasil diperbarui.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->delete();

        return back()->with('success', 'Kendaraan berhasil dihapus.');
    }
}
